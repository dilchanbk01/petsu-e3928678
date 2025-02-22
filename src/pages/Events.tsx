import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Search, Plus, Minus, X, CreditCard, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface CartItem {
  eventId: string;
  title: string;
  quantity: number;
  price: number;
}

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
    price: 499,
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

const QuantitySelector = ({ quantity, setQuantity }: { quantity: number; setQuantity: (n: number) => void }) => {
  return (
    <div className="flex items-center border-2 border-petsu-blue rounded-lg overflow-hidden">
      <Button
        type="button"
        variant="ghost"
        className="p-2 hover:bg-petsu-blue/10"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
      >
        <Minus className="h-4 w-4 text-petsu-blue" />
      </Button>
      <div className="px-4 py-1 text-petsu-blue font-semibold min-w-[80px] text-center">
        {quantity} {quantity === 1 ? 'person' : 'people'}
      </div>
      <Button
        type="button"
        variant="ghost"
        className="p-2 hover:bg-petsu-blue/10"
        onClick={() => setQuantity(Math.min(5, quantity + 1))}
      >
        <Plus className="h-4 w-4 text-petsu-blue" />
      </Button>
    </div>
  );
};

const EventCard = ({ event, onRegister }: { event: Event; onRegister: (event: Event, quantity: number) => void }) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);

  return (
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
          {!showQuantity ? (
            <Button 
              className="bg-petsu-blue text-white hover:bg-petsu-blue/90"
              onClick={() => setShowQuantity(true)}
            >
              Register Now
            </Button>
          ) : (
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
              <Button
                className="bg-petsu-blue text-white hover:bg-petsu-blue/90 whitespace-nowrap"
                onClick={() => {
                  onRegister(event, quantity);
                  setShowQuantity(false);
                  setQuantity(1);
                }}
              >
                Add to Cart
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CartModal = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  totalAmount,
  onCheckout 
}: { 
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  onCheckout: () => void;
}) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckout();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Your Cart</DialogTitle>
          <DialogDescription>
            Review your selected events and complete payment
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.eventId} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">
                    {item.quantity} {item.quantity === 1 ? 'ticket' : 'tickets'}
                  </p>
                </div>
                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <span className="font-bold">Total Amount:</span>
            <span className="font-bold text-xl">₹{totalAmount}</span>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={paymentDetails.name}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                required
                maxLength={16}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                  required
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  required
                  maxLength={3}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-petsu-blue text-white hover:bg-petsu-blue/90">
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ₹{totalAmount}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Events = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : sampleEvents;
  });
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const handleRegister = (event: Event, quantity: number) => {
    const newItem: CartItem = {
      eventId: event.id,
      title: event.title,
      quantity,
      price: event.price
    };

    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.eventId === event.id);
      if (existingItemIndex >= 0) {
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prev, newItem];
      }
    });

    toast({
      title: "Added to cart!",
      description: `${quantity} ticket${quantity > 1 ? 's' : ''} for ${event.title}`,
    });
  };

  const handleCheckout = () => {
    const existingTickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    const newTickets = cartItems.map(item => ({
      ...item,
      purchaseDate: new Date().toISOString(),
      status: 'active'
    }));
    
    localStorage.setItem('userTickets', JSON.stringify([...existingTickets, ...newTickets]));
    setCartItems([]);
    setShowCart(false);
    
    toast({
      title: "Payment Successful!",
      description: "Your tickets have been added to My Tickets.",
    });
    
    navigate('/my-tickets');
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen p-8">
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
          <Link to="/create-event">
            <button className="flex items-center gap-2 bg-petsu-blue text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </Link>
        </div>
      </div>

      <motion.h1 
        className="text-4xl font-bold text-petsu-yellow mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Upcoming Pet Events
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            onRegister={handleRegister}
          />
        ))}
      </div>

      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        totalAmount={totalAmount}
        onCheckout={handleCheckout}
      />

      {cartItems.length > 0 && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-petsu-blue text-white p-4 flex justify-between items-center"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
        >
          <div className="flex flex-col">
            <div className="text-lg font-bold">Total: ₹{totalAmount}</div>
            <div className="text-sm opacity-80">
              {cartItems.map((item, index) => (
                <span key={item.eventId}>
                  {item.quantity}x {item.title}
                  {index < cartItems.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
          <Button
            onClick={() => setShowCart(true)}
            className="bg-petsu-yellow text-petsu-blue px-6 py-2 rounded-full font-bold hover:opacity-90"
          >
            View Cart ({totalItems} {totalItems === 1 ? 'ticket' : 'tickets'})
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Events;
