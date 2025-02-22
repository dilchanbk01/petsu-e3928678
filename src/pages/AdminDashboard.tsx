
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Vet } from "@/types/vet";

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  creator_id: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!adminUser) {
        toast.error("Unauthorized access");
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin status:", error);
      navigate('/');
    }
  };

  const { data: pendingVets = [], refetch: refetchVets } = useQuery({
    queryKey: ['pending-vets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vets')
        .select('*')
        .eq('approval_status', 'pending');
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin
  });

  const { data: pendingEvents = [], refetch: refetchEvents } = useQuery({
    queryKey: ['pending-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('approval_status', 'pending');
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin
  });

  const updateVetStatus = async (vetId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('vets')
        .update({ approval_status: status })
        .eq('id', vetId);

      if (error) throw error;

      toast.success(`Vet ${status} successfully`);
      refetchVets();
    } catch (error) {
      console.error("Error updating vet status:", error);
      toast.error("Failed to update vet status");
    }
  };

  const updateEventStatus = async (eventId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ approval_status: status })
        .eq('id', eventId);

      if (error) throw error;

      toast.success(`Event ${status} successfully`);
      refetchEvents();
    } catch (error) {
      console.error("Error updating event status:", error);
      toast.error("Failed to update event status");
    }
  };

  if (!isAdmin) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mb-8">
        <Link to="/">
          <motion.div
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border-2 border-petsu-blue hover:bg-petsu-yellow/20 transition-all duration-300"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5 text-petsu-blue" />
          </motion.div>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-petsu-yellow mb-6">
          Admin Dashboard
        </h1>

        <Tabs defaultValue="vets" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="vets">
              Pending Vets ({pendingVets.length})
            </TabsTrigger>
            <TabsTrigger value="events">
              Pending Events ({pendingEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vets">
            <div className="grid gap-4">
              {pendingVets.map((vet: Vet) => (
                <div
                  key={vet.id}
                  className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={vet.image_url || '/placeholder.svg'}
                      alt={vet.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{vet.name}</h3>
                      <p className="text-gray-600">{vet.specialty}</p>
                      <p className="text-sm text-gray-500">
                        Location: {vet.location} • Experience: {vet.experience}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateVetStatus(vet.id, 'approved')}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => updateVetStatus(vet.id, 'rejected')}
                      variant="destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
              {pendingVets.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No pending vet applications
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="grid gap-4">
              {pendingEvents.map((event: Event) => (
                <div
                  key={event.id}
                  className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-gray-600">{event.type}</p>
                    <p className="text-sm text-gray-500">
                      {event.date} at {event.time} • {event.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateEventStatus(event.id, 'approved')}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => updateEventStatus(event.id, 'rejected')}
                      variant="destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
              {pendingEvents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No pending events
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
