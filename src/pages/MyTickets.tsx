
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface Ticket {
  eventId: string;
  title: string;
  quantity: number;
  price: number;
  purchaseDate: string;
  status: 'active' | 'used' | 'expired';
}

const MyTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const savedTickets = localStorage.getItem('userTickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <Link to="/events">
          <motion.div
            className="flex items-center text-petsu-yellow hover:text-petsu-blue transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="text-xl font-semibold">Back to Events</span>
          </motion.div>
        </Link>
        <Link to="/profile">
          <div className="flex items-center gap-2 text-petsu-yellow hover:text-petsu-blue transition-colors">
            <User className="w-6 h-6" />
            <span className="font-semibold">My Profile</span>
          </div>
        </Link>
      </div>

      <motion.h1 
        className="text-4xl font-bold text-petsu-yellow mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        My Tickets
      </motion.h1>

      <div className="grid gap-6">
        {tickets.map((ticket, index) => (
          <motion.div
            key={`${ticket.eventId}-${index}`}
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-petsu-blue mb-2">{ticket.title}</h3>
                <div className="flex items-center text-petsu-blue/70 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  <span>{ticket.quantity} {ticket.quantity === 1 ? 'person' : 'people'}</span>
                </div>
                <div className="text-sm text-petsu-blue/70">
                  Purchased on {new Date(ticket.purchaseDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-petsu-blue">
                  ₹{ticket.price * ticket.quantity}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  ticket.status === 'active' ? 'bg-green-100 text-green-800' :
                  ticket.status === 'used' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {tickets.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-petsu-blue text-lg">No tickets purchased yet.</p>
            <Link to="/events">
              <button className="mt-4 bg-petsu-blue text-white px-6 py-2 rounded-lg hover:bg-petsu-blue/90 transition-colors">
                Browse Events
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
