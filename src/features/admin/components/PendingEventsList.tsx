
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Event } from "../types/dashboard";

export const PendingEventsList = () => {
  const queryClient = useQueryClient();

  const { data: pendingEvents } = useQuery<Event[]>({
    queryKey: ['pendingEvents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_pending_events');

      if (error) {
        console.error('Error fetching pending events:', error);
        toast.error('Error fetching pending events');
        return [];
      }

      return data;
    }
  });

  const updateEventStatus = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: 'approved' | 'declined' }) => {
      const { error } = await supabase
        .rpc('update_event_status', { 
          event_id: eventId,
          new_status: status 
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingEvents'] });
      toast.success('Event status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating event status:', error);
      toast.error('Failed to update event status');
    }
  });

  return (
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
  );
};
