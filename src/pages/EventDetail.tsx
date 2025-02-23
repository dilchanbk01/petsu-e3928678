
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Users, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    // Fetch event from localStorage
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const foundEvent = events.find((e: Event) => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      toast.error("Event not found");
    }
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600">Event not found</h2>
          <Link to="/events" className="text-petsu-blue hover:underline mt-4 inline-block">
            Return to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50">
      <Link to="/events">
        <motion.div
          className="inline-flex items-center text-petsu-blue hover:text-petsu-yellow transition-colors mb-6"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Events</span>
        </motion.div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
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

          <div className="border-t pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-petsu-blue" />
                <span className="text-gray-600">
                  {event.availableTickets} spots available
                </span>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="border-2 border-petsu-blue text-petsu-blue hover:bg-petsu-blue/10"
                >
                  Share Event
                </Button>
                <Button className="bg-petsu-blue hover:bg-petsu-blue/90">
                  <Ticket className="w-4 h-4 mr-2" />
                  Book Now
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
