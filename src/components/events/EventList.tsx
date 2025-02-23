
import { motion } from "framer-motion";
import { Event } from "@/types/event";
import EventCard from "./EventCard";

interface EventListProps {
  events: Event[];
}

const EventList = ({ events }: EventListProps) => {
  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 sm:py-12"
      >
        <p className="text-petsu-blue text-base sm:text-lg">No events found matching your filters.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event}
        />
      ))}
    </div>
  );
};

export default EventList;
