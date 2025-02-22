
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Search, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
  availableTickets?: number;
}

// Cart item interface
interface CartItem {
  eventId: string;
  title: string;
  date: string;
  time: string;
  quantity: number;
  price: number;
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
    imageUrl: "/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png",
    availableTickets: 50
  },
  {
    id: "2",
    title: "Dog Training Workshop",
    date: "2024-03-22",
    time: "2:00 PM",
    location: "Pet Training Center",
    description: "Learn essential training techniques from expert trainers.",
    price: 49,
    imageUrl: "/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png",
    availableTickets: 20
  },
  {
    id: "3",
    title: "Pet Health Check-up Camp",
    date: "2024-03-25",
    time: "9:00 AM",
    location: "City Vet Clinic",
    description: "Free health check-up for your pets by experienced veterinarians.",
    price: 0,
    imageUrl: "/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png",
    availableTickets: 100
  }
];

const EventCard = ({ event, onRegister }: { event: Event; onRegister: (event: Event, quantity: number) => void }) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);
  const maxTickets = Math.min(event.availableTickets || 5, 5);

  return (
    <motion.div 
      className="bg-petsu-yellow rounded-xl overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
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
        <p className="text-petsu-blue mb-4 text-sm">{event.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-petsu-blue font-bold">
            {event.price === 0 ? "Free" : `₹${event.price}`}
          </span>
          {!showQuantity ? (
            <button 
              className="bg-petsu-blue text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => setShowQuantity(true)}
              disabled={event.availableTickets === 0}
            >
              {event.availableTickets === 0 ? "Sold Out" : "Register Now"}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-white text-petsu-blue border-2 border-petsu-blue rounded px-2 py-1"
              >
                {Array.from({ length: maxTickets }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "ticket" : "tickets"}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  onRegister(event, quantity);
                  setShowQuantity(false);
                  setQuantity(1);
                }}
                className="bg-petsu-blue text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CartSheet = ({ 
  cartItems, 
  onRemoveItem, 
  totalAmount 
}: { 
  cartItems: CartItem[]; 
  onRemoveItem: (eventId: string) => void;
  totalAmount: number;
}) => {
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Your Tickets</SheetTitle>
        <SheetDescription>
          Review your selected tickets before checkout
        </SheetDescription>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems.map((item) => (
          <div 
            key={item.eventId}
            className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h4 className="font-semibold text-petsu-blue">{item.title}</h4>
              <p className="text-sm text-gray-600">
                {item.date} at {item.time}
              </p>
              <p className="text-sm font-medium mt-1">
                {item.quantity} {item.quantity === 1 ? 'ticket' : 'tickets'} × ₹{item.price}
              </p>
            </div>
            <button
              onClick={() => onRemoveItem(item.eventId)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <SheetFooter className="mt-8">
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
          <Button 
            className="w-full bg-petsu-blue hover:bg-petsu-blue/90"
            onClick={() => {
              // Implement checkout logic here
              alert("Proceeding to checkout...");
            }}
          >
            Proceed to Checkout
          </Button>
        </div>
      </SheetFooter>
    </SheetContent>
  );
};

const Events = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : sampleEvents;
  });
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRegister = (event: Event, quantity: number) => {
    if (event.availableTickets !== undefined) {
      if (quantity > event.availableTickets) {
        toast({
          title: "Not enough tickets available",
          description: `Only ${event.availableTickets} tickets left for this event`,
          variant: "destructive"
        });
        return;
      }
      
      // Update available tickets
      setEvents(prevEvents => 
        prevEvents.map(e => 
          e.id === event.id 
            ? { ...e, availableTickets: (e.availableTickets || 0) - quantity }
            : e
        )
      );
    }

    const newItem: CartItem = {
      eventId: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      quantity,
      price: event.price
    };

    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.eventId === event.id);
      if (existingItemIndex >= 0) {
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }
      return [...prev, newItem];
    });

    toast({
      title: "Added to cart!",
      description: `${quantity} ticket${quantity > 1 ? 's' : ''} for ${event.title}`,
    });
  };

  const handleRemoveFromCart = (eventId: string) => {
    const removedItem = cartItems.find(item => item.eventId === eventId);
    if (removedItem) {
      // Restore available tickets
      setEvents(prevEvents =>
        prevEvents.map(e =>
          e.id === eventId
            ? { ...e, availableTickets: (e.availableTickets || 0) + removedItem.quantity }
            : e
        )
      );

      setCartItems(prev => prev.filter(item => item.eventId !== eventId));
      
      toast({
        title: "Removed from cart",
        description: `Removed ${removedItem.title} from your cart`,
      });
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full border-2 border-petsu-blue bg-white text-petsu-blue placeholder-petsu-blue/60 focus:outline-none focus:ring-2 focus:ring-petsu-blue"
            />
          </div>
          <Link to="/create-event">
            <button className="flex items-center gap-2 bg-petsu-blue text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </Link>
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
        {filteredEvents.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            onRegister={handleRegister}
          />
        ))}
      </div>

      {/* Cart Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          {cartItems.length > 0 && (
            <motion.div 
              className="fixed bottom-8 right-8 bg-petsu-blue text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-petsu-blue/90 transition-colors"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold">View Cart ({totalItems})</span>
                <span>₹{totalAmount}</span>
              </div>
            </motion.div>
          )}
        </SheetTrigger>
        <CartSheet 
          cartItems={cartItems}
          onRemoveItem={handleRemoveFromCart}
          totalAmount={totalAmount}
        />
      </Sheet>
    </div>
  );
};

export default Events;
