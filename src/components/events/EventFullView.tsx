
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Ticket, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Event } from "@/types/event";
import TicketConfirmation from "./TicketConfirmation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

interface EventFullViewProps {
  event: Event;
  onClose: () => void;
}

const EventFullView = ({ event, onClose }: EventFullViewProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const maxTickets = Math.min(event.availableTickets || 5, 5);
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();

  const handleRegister = async () => {
    if (!session?.user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book tickets",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: event.id,
          user_id: session.user.id,
          quantity: quantity,
          status: 'confirmed'
        });

      if (error) throw error;

      setShowConfirmation(true);
    } catch (error) {
      console.error('Error booking tickets:', error);
      toast({
        title: "Error",
        description: "Failed to book tickets. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative min-h-screen">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg"
        >
          <ArrowLeft className="w-6 h-6 text-petsu-blue" />
        </button>

        <div className="w-full h-72 relative">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-petsu-blue mb-6">{event.title}</h1>
            
            <div className="space-y-6">
              <p className="text-lg text-petsu-blue/80">{event.description}</p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center text-petsu-blue">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center text-petsu-blue">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-petsu-blue">
                  <Ticket className="w-5 h-5 mr-2" />
                  <span>{event.availableTickets} tickets available</span>
                </div>
              </div>

              <div className="border-t border-b border-petsu-blue/10 py-6 my-6">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-petsu-blue">
                    {event.price === 0 ? "Free" : `₹${event.price}`}
                  </span>
                  {!showQuantity ? (
                    <Button 
                      className="bg-petsu-blue text-white hover:bg-petsu-blue/90"
                      onClick={() => setShowQuantity(true)}
                      disabled={event.availableTickets === 0}
                    >
                      {event.availableTickets === 0 ? "Sold Out" : "Register Now"}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="bg-white text-petsu-blue border-2 border-petsu-blue rounded-lg px-4 py-2"
                      >
                        {Array.from({ length: maxTickets }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "ticket" : "tickets"}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={handleRegister}
                        className="bg-petsu-blue text-white hover:bg-petsu-blue/90"
                      >
                        {event.price === 0 ? "Book Now" : "Proceed to Payment"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirmation && (
          <TicketConfirmation
            eventTitle={event.title}
            date={event.date}
            time={event.time}
            location={event.location}
            quantity={quantity}
            onClose={() => {
              setShowConfirmation(false);
              navigate("/profile");
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventFullView;
