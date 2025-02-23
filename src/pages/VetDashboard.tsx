import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, Settings, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Appointment, ConsultationRequest, Vet } from "@/types/vet";
import { useQuery } from "@tanstack/react-query";
import ConsultationRoom from "@/components/ConsultationRoom";
import VetProfile from "@/components/vet-dashboard/VetProfile";
import ConsultationRequestCard from "@/components/vet-dashboard/ConsultationRequestCard";
import AppointmentsList from "@/components/vet-dashboard/AppointmentsList";
import VetInsights from "@/components/vet-dashboard/VetInsights";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";

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
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className={`${activeTab === 'consultations' ? 'bg-blue-100' : ''}`}
              onClick={() => setActiveTab('consultations')}
            >
              Consultations
            </Button>
            <Button
              variant="ghost"
              className={`${activeTab === 'profile' ? 'bg-blue-100' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </Button>
            <Button
              variant="ghost"
              className={`${activeTab === 'insights' ? 'bg-blue-100' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              Insights
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={toggleOnlineStatus}
              className={`${
                isOnline ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'
              } text-white`}
            >
              {isOnline ? (
                <ToggleRight className="w-5 h-5 mr-2" />
              ) : (
                <ToggleLeft className="w-5 h-5 mr-2" />
              )}
              {isOnline ? 'Online' : 'Offline'}
            </Button>

            <Button 
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {activeTab === 'consultations' && (
          <div className="space-y-6">
            {consultationRequests.length > 0 && (
              <div className="bg-blue-600 rounded-xl p-6 text-white">
                <h2 className="text-xl font-semibold mb-4">Consultation Requests</h2>
                <div className="space-y-4">
                  {consultationRequests.map((request) => (
                    <div key={request.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex justify-between items-center">
                      <span className="text-lg">User {request.user_id.slice(0, 8)}</span>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleConsultationRequest(request.id, 'approved')}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleConsultationRequest(request.id, 'rejected')}
                          variant="outline"
                          className="border-red-400 text-red-400 hover:bg-red-400/10"
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
