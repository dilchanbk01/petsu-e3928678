
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToggleRight, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Appointment, ConsultationRequest, Vet } from "@/types/vet";
import { useQuery } from "@tanstack/react-query";
import ConsultationRoom from "@/components/ConsultationRoom";
import VetProfile from "@/components/vet-dashboard/VetProfile";
import ConsultationRequestCard from "@/components/vet-dashboard/ConsultationRequestCard";
import AppointmentsList from "@/components/vet-dashboard/AppointmentsList";

const VetDashboard = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [isOnline, setIsOnline] = useState(true);
  const [vetDetails, setVetDetails] = useState<Vet | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);

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
    <div className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          className="text-2xl font-bold text-petsu-yellow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Vet Dashboard
        </motion.h1>

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
      </div>

      {vetDetails && <VetProfile vetDetails={vetDetails} />}

      {consultationRequests.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Pending Consultation Requests</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {consultationRequests.map((request) => (
              <ConsultationRequestCard
                key={request.id}
                request={request}
                onAccept={(id) => handleConsultationRequest(id, 'approved')}
                onDecline={(id) => handleConsultationRequest(id, 'rejected')}
              />
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

      {selectedConsultation && (
        <ConsultationRoom
          sessionId={selectedConsultation}
          userId={vetDetails?.id || ''}
          vetId={vetDetails?.id || ''}
          onClose={() => setSelectedConsultation(null)}
        />
      )}
    </div>
  );
};

export default VetDashboard;
