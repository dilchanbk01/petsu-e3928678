
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Users, Ticket, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data: event, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (event) {
          setEvent(event);
        } else {
          toast.error("Event not found");
        }
      } catch (error: any) {
        console.error('Error fetching event:', error);
        toast.error(error.message || "Failed to load event");
      }
    };

    fetchEvent();
  }, [id]);

  const handleShare = async (platform: 'whatsapp' | 'instagram') => {
    const eventUrl = window.location.href;
    const text = `Check out this event: ${event?.title}`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + eventUrl)}`, '_blank');
        break;
      case 'instagram':
        try {
          await navigator.clipboard.writeText(text + ' ' + eventUrl);
          toast.success("Link copied! You can now share it on Instagram");
        } catch (err) {
          toast.error("Failed to copy link");
        }
        break;
    }
  };

  const handleBooking = async () => {
    if (!session) {
      toast.error("Please sign in to book tickets");
      return;
    }

    if (!event?.available_tickets || event.available_tickets <= 0) {
      toast.error("Sorry, this event is sold out!");
      return;
    }

    setIsLoading(true);

    try {
      // Insert booking record
      const { error: bookingError } = await supabase
        .from('event_bookings')
        .insert({
          event_id: event.id,
          user_id: session.user.id,
          quantity: 1
        });

      if (bookingError) throw bookingError;

      // Fetch updated event details
      const { data: updatedEvent, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (eventError) throw eventError;

      setEvent(updatedEvent);
      toast.success("Booking successful! Check your email for details.");
    } catch (error: any) {
      console.error('Error booking ticket:', error);
      toast.error(error.message || "Failed to book ticket");
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petsu-green">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Event not found</h2>
          <Link to="/events" className="text-petsu-yellow hover:underline mt-4 inline-block">
            Return to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-petsu-green">
      <Link to="/events">
        <motion.div
          className="inline-flex items-center text-white hover:text-petsu-yellow transition-colors mb-6"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Events</span>
        </motion.div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border-2 border-petsu-blue"
      >
        <div className="relative h-64 sm:h-80">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {event.availableTickets !== undefined && event.availableTickets <= 10 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full">
              Only {event.availableTickets} tickets left!
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-petsu-blue mb-4">
            {event.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2 text-petsu-blue" />
              <span>{event.date} at {event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2 text-petsu-blue" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-gray-600">{event.description}</p>
          </div>

          <div className="border-t border-petsu-blue/20 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-petsu-blue" />
                <span className="text-gray-600">
                  {event.availableTickets} spots available
                </span>
              </div>
              <div className="flex gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-2 border-petsu-blue text-petsu-blue hover:bg-petsu-blue/10"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Event
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                      Share on WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('instagram')}>
                      Share on Instagram
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  className="bg-petsu-blue hover:bg-petsu-blue/90"
                  onClick={handleBooking}
                  disabled={!event.availableTickets || event.availableTickets <= 0 || isLoading}
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  {isLoading ? "Booking..." : "Book Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetail;

