
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ConsultationRequest, Vet } from "@/types/vet";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";
import ConsultationRoom from "@/components/ConsultationRoom";
import VetProfile from "@/components/vet-dashboard/VetProfile";
import AppointmentsList from "@/components/vet-dashboard/AppointmentsList";
import VetInsights from "@/components/vet-dashboard/VetInsights";
import DashboardHeader from "@/components/vet-dashboard/DashboardHeader";
import ConsultationRequests from "@/components/vet-dashboard/ConsultationRequests";

const VetDashboard = () => {
  const [activeTab, setActiveTab] = useState<'consultations' | 'profile' | 'insights'>('consultations');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [isOnline, setIsOnline] = useState(true);
  const [vetDetails, setVetDetails] = useState<Vet | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const fetchVetDetails = async () => {
    const { data: vetData, error } = await supabase
      .from('vets')
      .select('*')
      .single();

    if (error) {
      toast.error("Failed to load vet details");
      return;
    }

    setVetDetails(vetData);
    return vetData;
  };

  useEffect(() => {
    fetchVetDetails();
  }, []);

  const toggleOnlineStatus = async () => {
    try {
      if (!vetDetails) return;

      const newStatus = !isOnline;

      const { error } = await supabase
        .from('vet_availability')
        .upsert({
          vet_id: vetDetails.id,
          is_online: newStatus,
          last_seen_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsOnline(newStatus);
      toast.success(`You are now ${newStatus ? 'online' : 'offline'}`);
    } catch (error) {
      console.error('Error toggling online status:', error);
      toast.error("Failed to update online status");
    }
  };

  const handleConsultationRequest = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({ status: action })
        .eq('id', requestId);

      if (error) throw error;

      if (action === 'approved') {
        setSelectedConsultation(requestId);
      }

      setConsultationRequests(prev => 
        prev.filter(request => request.id !== requestId)
      );

      toast.success(`Consultation request ${action}`);
    } catch (error) {
      console.error('Error handling consultation request:', error);
      toast.error("Failed to update consultation request");
    }
  };

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['vet-appointments'],
    queryFn: async () => {
      if (!vetDetails?.id) return [];
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('vet_id', vetDetails.id)
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!vetDetails?.id
  });

  const { data: insights = null, isLoading: isLoadingInsights } = useQuery({
    queryKey: ['vet-insights', vetDetails?.id],
    queryFn: async () => {
      if (!vetDetails?.id) return null;
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('vet_id', vetDetails.id)
        .eq('status', 'completed')
        .gte('appointment_time', thirtyDaysAgo.toISOString());

      if (error) throw error;

      const totalEarnings = data.reduce((sum, app) => sum + app.amount, 0);
      const completedCount = data.length;

      const byDay = data.reduce((acc, app) => {
        const date = new Date(app.appointment_time).toLocaleDateString();
        acc[date] = (acc[date] || 0) + app.amount;
        return acc;
      }, {});

      const byWeek = data.reduce((acc, app) => {
        const date = new Date(app.appointment_time);
        const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
        acc[week] = (acc[week] || 0) + app.amount;
        return acc;
      }, {});

      return {
        totalEarnings,
        completedCount,
        byDay,
        byWeek,
        recentCompletions: data.slice(-5)
      };
    },
    enabled: !!vetDetails?.id
  });

  useEffect(() => {
    const channel = supabase.channel('dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'consultation_requests' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            toast.info("New consultation request received!");
            setConsultationRequests(prev => [...prev, payload.new as ConsultationRequest]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          activeTab={activeTab}
          isOnline={isOnline}
          onTabChange={setActiveTab}
          onToggleOnline={toggleOnlineStatus}
          onLogout={handleLogout}
        />

        {activeTab === 'consultations' && (
          <div className="space-y-6">
            <ConsultationRequests
              requests={consultationRequests}
              onAccept={(id) => handleConsultationRequest(id, 'approved')}
              onDecline={(id) => handleConsultationRequest(id, 'rejected')}
            />

            <AppointmentsList
              appointments={appointments}
              isLoading={isLoading}
              filter={filter}
              onFilterChange={setFilter}
            />
          </div>
        )}

        {activeTab === 'profile' && vetDetails && (
          <VetProfile vetDetails={vetDetails} />
        )}

        {activeTab === 'insights' && insights && !isLoadingInsights && (
          <VetInsights insights={insights} />
        )}

        {selectedConsultation && (
          <ConsultationRoom
            sessionId={selectedConsultation}
            userId={vetDetails?.id || ''}
            vetId={vetDetails?.id || ''}
            onClose={() => setSelectedConsultation(null)}
          />
        )}
      </div>
    </div>
  );
};

export default VetDashboard;
