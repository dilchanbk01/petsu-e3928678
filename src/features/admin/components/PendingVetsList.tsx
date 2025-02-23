
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Vet } from "@/types/vet";

export const PendingVetsList = () => {
  const queryClient = useQueryClient();

  const { data: pendingVets } = useQuery<Vet[]>({
    queryKey: ['pendingVets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_pending_vets');

      if (error) {
        console.error('Error fetching pending vets:', error);
        toast.error('Error fetching pending vets');
        return [];
      }

      return data;
    }
  });

  const updateVetStatus = useMutation({
    mutationFn: async ({ vetId, status }: { vetId: string; status: 'approved' | 'declined' }) => {
      const { error } = await supabase
        .rpc('update_vet_status', { 
          vet_id: vetId,
          new_status: status 
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingVets'] });
      toast.success('Vet status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating vet status:', error);
      toast.error('Failed to update vet status');
    }
  });

  return (
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
  );
};
