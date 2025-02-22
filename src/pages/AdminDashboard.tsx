
import { motion } from "framer-motion";
import { LogOut, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Vet } from "@/types/vet";

interface Event {
  id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  approval_status: 'pending' | 'approved' | 'declined';
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: adminRole } = useQuery({
    queryKey: ['adminRole'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching admin role:', error);
        toast.error('Error fetching admin role');
        return null;
      }

      return data;
    }
  });

  const { data: pendingEvents } = useQuery({
    queryKey: ['pendingEvents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('approval_status', 'pending');

      if (error) {
        toast.error('Error fetching pending events');
        throw error;
      }

      return data as Event[];
    }
  });

  const { data: pendingVets } = useQuery({
    queryKey: ['pendingVets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vets')
        .select('*')
        .eq('approval_status', 'pending');

      if (error) {
        toast.error('Error fetching pending vets');
        throw error;
      }

      return data as Vet[];
    }
  });

  const updateEventStatus = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: 'approved' | 'declined' }) => {
      const { error } = await supabase
        .from('events')
        .update({ approval_status: status })
        .eq('id', eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingEvents'] });
      toast.success('Event status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update event status');
    }
  });

  const updateVetStatus = useMutation({
    mutationFn: async ({ vetId, status }: { vetId: string; status: 'approved' | 'declined' }) => {
      const { error } = await supabase
        .from('vets')
        .update({ approval_status: status })
        .eq('id', vetId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingVets'] });
      toast.success('Vet status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update vet status');
    }
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin-auth");
  };

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-petsu-blue">Admin Dashboard</h1>
            {adminRole && (
              <p className="text-gray-600 mt-1 capitalize">
                Role: {adminRole.role}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            className="border-2 border-petsu-blue text-petsu-blue hover:bg-petsu-blue/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Events Section */}
          <div className="bg-white p-6 rounded-xl border-2 border-petsu-blue">
            <h2 className="text-xl font-semibold text-petsu-blue mb-4">
              Pending Events
            </h2>
            <div className="space-y-4">
              {!pendingEvents?.length && (
                <p className="text-gray-500">No pending events</p>
              )}
              {pendingEvents?.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{event.date}</span>
                    <span>•</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white pointer-events-auto"
                      onClick={() => {
                        updateEventStatus.mutate({ 
                          eventId: event.id, 
                          status: 'approved' 
                        });
                      }}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="pointer-events-auto"
                      onClick={() => {
                        updateEventStatus.mutate({ 
                          eventId: event.id, 
                          status: 'declined' 
                        });
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Vets Section */}
          <div className="bg-white p-6 rounded-xl border-2 border-petsu-blue">
            <h2 className="text-xl font-semibold text-petsu-blue mb-4">
              Pending Vets
            </h2>
            <div className="space-y-4">
              {!pendingVets?.length && (
                <p className="text-gray-500">No pending vets</p>
              )}
              {pendingVets?.map((vet) => (
                <div
                  key={vet.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <h3 className="font-medium">{vet.name}</h3>
                  <p className="text-sm text-gray-600">{vet.specialty}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{vet.location}</span>
                    <span>•</span>
                    <span>{vet.experience} years experience</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white pointer-events-auto"
                      onClick={() => {
                        updateVetStatus.mutate({ 
                          vetId: vet.id, 
                          status: 'approved' 
                        });
                      }}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="pointer-events-auto"
                      onClick={() => {
                        updateVetStatus.mutate({ 
                          vetId: vet.id, 
                          status: 'declined' 
                        });
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
