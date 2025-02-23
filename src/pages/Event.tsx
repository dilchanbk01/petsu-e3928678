
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, ArrowLeft, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import TicketConfirmation from "@/components/events/TicketConfirmation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data: eventData, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!eventData) {
          navigate('/events');
          return;
        }

        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive"
        });
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate, toast]);

  const handleRegister = async () => {
    if (!session?.user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book tickets",
        variant: "destructive"
      });
      navigate('/auth', { state: { redirectTo: `/events/${id}` } });
      return;
    }

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: event!.id,
          user_id: session.user.id,
          quantity: quantity,
          status: 'confirmed'
        });

      if (error) throw error;

      setShowConfirmation(true);
      
      // Refresh event data to get updated ticket count
      const { data: updatedEvent } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
        
      if (updatedEvent) {
        setEvent(updatedEvent);
      }

    } catch (error) {
      console.error('Error booking tickets:', error);
      toast({
        title: "Error",
        description: "Failed to book tickets. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event!.title,
        text: event!.description,
        url: window.location.href,
      });
    }
  };

  const handleLocationClick = () => {
    if (event?.latitude && event?.longitude) {
      window.open(`https://www.google.com/maps?q=${event.latitude},${event.longitude}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-petsu-blue"></div>
      </div>
    );
  }

  if (!event) return null;

  const maxTickets = Math.min(event.availableTickets || 5, 5);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-black">
        <img 
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        
        <Link to="/events" className="absolute top-4 left-4 z-10">
          <motion.div
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </motion.div>
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{event.time}</span>
              </div>
              <button
                onClick={handleLocationClick}
                className="flex items-center hover:text-white/80 transition-colors"
              >
                <MapPin className="w-5 h-5 mr-2" />
                <span>{event.location}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
              <h2 className="text-2xl font-bold">About Event</h2>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="md:w-80">
            <div className="bg-white rounded-xl p-6 shadow-md space-y-4 sticky top-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {event.price === 0 ? "Free" : `₹${event.price}`}
                </span>
                <Button 
                  size="icon"
                  variant="outline"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              {!showQuantity ? (
                <Button 
                  className="w-full bg-[#DF1B1B] hover:bg-[#DF1B1B]/90 text-white"
                  onClick={() => setShowQuantity(true)}
                  disabled={event.availableTickets === 0}
                >
                  {event.availableTickets === 0 ? "Sold Out" : "Book Now"}
                </Button>
              ) : (
                <div className="space-y-4">
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-white text-gray-900 border rounded-lg px-4 py-2"
                  >
                    {Array.from({ length: maxTickets }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "ticket" : "tickets"}
                      </option>
                    ))}
                  </select>
                  <Button
                    className="w-full bg-[#DF1B1B] hover:bg-[#DF1B1B]/90 text-white"
                    onClick={handleRegister}
                  >
                    {event.price === 0 ? "Book Now" : "Proceed to Payment"}
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-center text-sm text-gray-500">
                <Ticket className="w-4 h-4 mr-1" />
                <span>{event.availableTickets} tickets left</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default EventPage;
