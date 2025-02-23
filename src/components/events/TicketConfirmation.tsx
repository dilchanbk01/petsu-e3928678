
import { motion } from "framer-motion";
import { Ticket, Calendar, MapPin, Check } from "lucide-react";

interface TicketConfirmationProps {
  eventTitle: string;
  date: string;
  time: string;
  location: string;
  quantity: number;
  onClose: () => void;
}

const TicketConfirmation = ({ 
  eventTitle, 
  date, 
  time, 
  location, 
  quantity, 
  onClose 
}: TicketConfirmationProps) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
        initial={{ scale: 0.5, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.3 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-petsu-blue">Booking Confirmed!</h2>
          
          <motion.div
            className="w-full bg-petsu-yellow/20 rounded-xl p-6 space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Ticket className="w-8 h-8 text-petsu-blue mx-auto" />
            <h3 className="text-xl font-semibold text-petsu-blue">{eventTitle}</h3>
            
            <div className="space-y-2 text-petsu-blue/80">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{date} at {time}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            </div>
            
            <div className="text-petsu-blue font-medium">
              {quantity} {quantity === 1 ? 'Ticket' : 'Tickets'}
            </div>
          </motion.div>
          
          <motion.button
            className="bg-petsu-blue text-white px-6 py-2 rounded-full font-medium hover:bg-petsu-blue/90 transition-colors"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            View My Tickets
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TicketConfirmation;
