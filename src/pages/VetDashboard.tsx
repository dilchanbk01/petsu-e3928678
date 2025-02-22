
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Video, MessageSquare, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "@/types/vet";
import { useQuery } from "@tanstack/react-query";

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointment.id);

      if (error) throw error;
      toast.success(`Appointment ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-petsu-blue" />
            <span className="font-medium">
              {new Date(appointment.appointment_time).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span>Patient ID: {appointment.user_id.slice(0, 8)}</span>
          </div>
          <div className="flex items-center gap-2">
            {appointment.session_type === 'video' ? (
              <Video className="w-4 h-4 text-gray-500" />
            ) : (
              <MessageSquare className="w-4 h-4 text-gray-500" />
            )}
            <span className="capitalize">{appointment.session_type} Consultation</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
            appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {appointment.status}
          </span>
          <span className="font-bold text-petsu-blue">${appointment.amount}</span>
        </div>
      </div>

      {appointment.status === 'pending' && (
        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => handleUpdateStatus('confirmed')}
            disabled={isUpdating}
            className="flex-1 bg-green-500 hover:bg-green-600"
          >
            <Check className="w-4 h-4 mr-2" />
            Confirm
          </Button>
          <Button
            onClick={() => handleUpdateStatus('cancelled')}
            disabled={isUpdating}
            variant="outline"
            className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}

      {appointment.status === 'confirmed' && (
        <div className="mt-4">
          <Button
            onClick={() => handleUpdateStatus('completed')}
            disabled={isUpdating}
            className="w-full bg-petsu-blue hover:bg-petsu-blue/90"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark as Completed
          </Button>
        </div>
      )}
    </motion.div>
  );
};

const VetDashboard = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  const fetchAppointments = async () => {
    const { data: vetData, error: vetError } = await supabase
      .from('vets')
      .select('id')
      .single();

    if (vetError) throw vetError;

    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('vet_id', vetData.id)
      .order('appointment_time', { ascending: true });

    if (appointmentsError) throw appointmentsError;
    return appointments;
  };

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['vet-appointments'],
    queryFn: fetchAppointments
  });

  const filteredAppointments = appointments.filter(appointment => 
    filter === 'all' ? true : appointment.status === filter
  );

  useEffect(() => {
    const channel = supabase.channel('appointments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('Appointment update:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <motion.h1 
        className="text-2xl font-bold text-petsu-yellow mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Vet Dashboard
      </motion.h1>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
            className={`capitalize ${
              filter === status 
                ? 'bg-petsu-blue hover:bg-petsu-blue/90' 
                : 'hover:bg-gray-50'
            }`}
          >
            {status}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading appointments...</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No {filter === 'all' ? '' : filter} appointments found
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VetDashboard;
