
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";

// Event type definition
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: number;
  imageUrl: string;
}

// Sample events data
const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Pet Adoption Day",
    date: "2024-03-20",
    time: "10:00 AM",
    location: "Central Park",
    description: "Find your perfect furry companion at our adoption event.",
    price: 0,
    imageUrl: "/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png"
  },
  {
    id: "2",
    title: "Dog Training Workshop",
    date: "2024-03-22",
    time: "2:00 PM",
    location: "Pet Training Center",
    description: "Learn essential training techniques from expert trainers.",
    price: 49,
    imageUrl: "/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png"
  },
  {
    id: "3",
    title: "Pet Health Check-up Camp",
    date: "2024-03-25",
    time: "9:00 AM",
    location: "City Vet Clinic",
    description: "Free health check-up for your pets by experienced veterinarians.",
    price: 0,
    imageUrl: "/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png"
  }
];

const EventCard = ({ event }: { event: Event }) => (
  <motion.div 
    className="bg-petsu-yellow rounded-xl overflow-hidden shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
  >
    <img 
      src={event.imageUrl} 
      alt={event.title} 
      className="w-full h-48 object-cover"
    />
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
      <p className="text-petsu-blue mb-4 text-sm">{event.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-petsu-blue font-bold">
          {event.price === 0 ? "Free" : `₹${event.price}`}
        </span>
        <button className="bg-petsu-blue text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          Register Now
        </button>
      </div>
    </div>
  </motion.div>
);

const Events = () => {
  return (
    <div className="min-h-screen p-8">
      {/* Header with back button and search */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/">
          <motion.div
            className="flex items-center text-petsu-yellow hover:text-petsu-blue transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="text-xl font-semibold">Back to Home</span>
          </motion.div>
        </Link>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-petsu-blue w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 rounded-full border-2 border-petsu-blue bg-white text-petsu-blue placeholder-petsu-blue/60 focus:outline-none focus:ring-2 focus:ring-petsu-blue"
            />
          </div>
          <button className="flex items-center gap-2 bg-petsu-blue text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>
      </div>

      {/* Main heading */}
      <motion.h1 
        className="text-4xl font-bold text-petsu-yellow mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Upcoming Pet Events
      </motion.h1>

      {/* Event grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sampleEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Footer with cart */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-petsu-blue text-white p-4 flex justify-between items-center"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        <div className="text-lg font-bold">Total: ₹49</div>
        <button className="bg-petsu-yellow text-petsu-blue px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity">
          View Cart (1)
        </button>
      </motion.div>
    </div>
  );
};

export default Events;
