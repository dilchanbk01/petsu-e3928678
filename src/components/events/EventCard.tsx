
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <motion.div 
      className="bg-petsu-yellow rounded-xl overflow-hidden shadow-lg cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-48 object-cover"
        />
        {event.availableTickets !== undefined && event.availableTickets <= 10 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            Only {event.availableTickets} tickets left!
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-petsu-blue mb-2">{event.title}</h3>
        <div className="flex items-center text-petsu-blue mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">{event.date} at {event.time}</span>
        </div>
        <div className="flex items-center text-petsu-blue mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{event.location}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
