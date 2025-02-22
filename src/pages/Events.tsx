import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Search, Plus, Trash2, Filter, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: number;
  image_url: string;
  available_tickets: number;
  type: string;
  creator_id: string;
}

interface CartItem {
  eventId: string;
  title: string;
  date: string;
  time: string;
  quantity: number;
  price: number;
}

const FilterBar = ({ 
  onFilterChange 
}: { 
  onFilterChange: (filters: { 
    searchTerm: string; 
    dateFilter: string; 
    showFreeOnly: boolean;
    eventType: string;
  }) => void 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [eventType, setEventType] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (
    type: "search" | "date" | "free" | "type",
    value: string | boolean
  ) => {
    let newSearchTerm = searchTerm;
    let newDateFilter = dateFilter;
    let newShowFreeOnly = showFreeOnly;
    let newEventType = eventType;

    switch (type) {
      case "search":
        newSearchTerm = value as string;
        setSearchTerm(newSearchTerm);
        break;
      case "date":
        newDateFilter = value as string;
        setDateFilter(newDateFilter);
        break;
      case "free":
        newShowFreeOnly = value as boolean;
        setShowFreeOnly(newShowFreeOnly);
        break;
      case "type":
        newEventType = value as string;
        setEventType(newEventType);
        break;
    }

    onFilterChange({
      searchTerm: newSearchTerm,
      dateFilter: newDateFilter,
      showFreeOnly: newShowFreeOnly,
      eventType: newEventType,
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-petsu-blue/60 w-4 h-4" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => handleChange("search", e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-full border-2 border-petsu-blue bg-white text-petsu-blue placeholder-petsu-blue/60 focus:outline-none focus:ring-2 focus:ring-petsu-blue"
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 flex items-center justify-between text-petsu-blue hover:bg-white/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <h2 className="text-sm font-medium">Filter Events</h2>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-4 h-4 rotate-90" />
          </motion.div>
        </button>

        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="p-4 pt-0 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Select
                value={dateFilter}
                onValueChange={(value) => handleChange("date", value)}
              >
                <SelectTrigger className="w-full rounded-full border-2 border-petsu-blue">
                  <Calendar className="w-4 h-4 mr-2 text-petsu-blue/60" />
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={eventType}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger className="w-full rounded-full border-2 border-petsu-blue">
                  <MapPin className="w-4 h-4 mr-2 text-petsu-blue/60" />
                  <SelectValue placeholder="Event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="Adoption">Adoption</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Competition">Competition</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center justify-center px-4 py-2 rounded-full border-2 border-petsu-blue bg-white">
                <Switch
                  id="free-events"
                  checked={showFreeOnly}
                  onCheckedChange={(checked) => handleChange("free", checked)}
                  className="mr-2"
                />
                <Label htmlFor="free-events" className="text-sm text-petsu-blue cursor-pointer">
                  Free events only
                </Label>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const EventCard = ({ event, onRegister }: { event: Event; onRegister: (event: Event, quantity: number) => void }) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);
  const maxTickets = Math.min(event.available_tickets || 5, 5);

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
          src={event.image_url} 
          alt={event.title} 
          className="w-full h-48 object-cover"
        />
        {event.available_tickets !== undefined && event.available_tickets <= 10 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            Only {event.available_tickets} tickets left!
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
              disabled={event.available_tickets === 0}
            >
              {event.available_tickets === 0 ? "Sold Out" : "Register Now"}
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
                    {num} {num === 1 ? 'ticket' : 'tickets'}
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
        <SheetTitle>Your Cart</SheetTitle>
        <SheetDescription>
          Review your selected event tickets
        </SheetDescription>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems.map((item) => (
          <div 
            key={item.eventId}
            className="flex items-start justify-between p-4 bg-white rounded-lg border border-petsu-blue/20"
          >
            <div>
              <h4 className="font-semibold text-petsu-blue">{item.title}</h4>
              <p className="text-sm text-petsu-blue/60">
                {item.date} at {item.time}
              </p>
              <p className="text-sm font-medium mt-1 text-petsu-blue">
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
          <div className="flex justify-between items-center font-semibold text-lg text-petsu-blue">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
          <Button 
            className="w-full bg-petsu-blue hover:bg-petsu-blue/90"
            onClick={() => {
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
  const { session } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    dateFilter: "all",
    showFreeOnly: false,
    eventType: "all"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        throw error;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: Event, quantity: number) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for events",
        variant: "destructive"
      });
      return;
    }

    if (quantity > event.available_tickets) {
      toast({
        title: "Not enough tickets available",
        description: `Only ${event.available_tickets} tickets left for this event`,
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: event.id,
          user_id: session.user.id,
          quantity,
          status: 'pending'
        })
        .select('*')
        .single();

      if (error) throw error;

      const newItem: CartItem = {
        eventId: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        quantity,
        price: event.price
      };

      setCartItems(prev => [...prev, newItem]);
      
      await fetchEvents();

      toast({
        title: "Added to cart!",
        description: `${quantity} ticket${quantity > 1 ? 's' : ''} for ${event.title}`,
      });
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Error",
        description: "Failed to add tickets to cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFromCart = async (eventId: string) => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', session.user.id)
        .eq('status', 'pending');

      if (error) throw error;

      setCartItems(prev => prev.filter(item => item.eventId !== eventId));
      await fetchEvents();

      toast({
        title: "Removed from cart",
        description: "The tickets have been removed from your cart",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove tickets from cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadCartItems = async () => {
      if (!session) return;

      try {
        const { data, error } = await supabase
          .from('event_registrations')
          .select(`
            *,
            events:event_id (
              title,
              date,
              time,
              price
            )
          `)
          .eq('user_id', session.user.id)
          .eq('status', 'pending');

        if (error) throw error;

        const cartItems: CartItem[] = data.map(registration => ({
          eventId: registration.event_id,
          title: registration.events.title,
          date: registration.events.date,
          time: registration.events.time,
          quantity: registration.quantity,
          price: registration.events.price
        }));

        setCartItems(cartItems);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCartItems();
  }, [session]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesPrice = !filters.showFreeOnly || event.price === 0;
    
    const matchesType = filters.eventType === "all" || event.type === filters.eventType;

    let matchesDate = true;
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filters.dateFilter) {
      case "today":
        matchesDate = eventDate.toDateString() === today.toDateString();
        break;
      case "week":
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        matchesDate = eventDate >= today && eventDate <= weekFromNow;
        break;
      case "month":
        const monthFromNow = new Date(today);
        monthFromNow.setMonth(monthFromNow.getMonth() + 1);
        matchesDate = eventDate >= today && eventDate <= monthFromNow;
        break;
    }

    return matchesSearch && matchesPrice && matchesDate && matchesType;
  });

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-petsu-blue">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <Link to="/">
          <motion.div
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border-2 border-petsu-blue hover:bg-petsu-yellow/20 transition-all duration-300"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5 text-petsu-blue" />
          </motion.div>
        </Link>
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <motion.button 
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  cartItems.length > 0 
                    ? 'bg-petsu-blue text-white hover:opacity-90' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={cartItems.length > 0 ? { scale: 1.02 } : {}}
                initial={false}
              >
                <Ticket className="w-4 h-4" />
                {cartItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{totalItems} items</span>
                    <span className="text-sm">•</span>
                    <span className="text-sm">₹{totalAmount}</span>
                  </div>
                )}
              </motion.button>
            </SheetTrigger>
            <CartSheet 
              cartItems={cartItems}
              onRemoveItem={handleRemoveFromCart}
              totalAmount={totalAmount}
            />
          </Sheet>
          <Link to="/create-event">
            <button className="flex items-center gap-2 bg-petsu-blue text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Create Event</span>
            </button>
          </Link>
        </div>
      </div>

      <motion.h1 
        className="text-xl sm:text-2xl font-bold text-petsu-yellow mb-6 sm:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Upcoming Pet Events
      </motion.h1>

      <FilterBar onFilterChange={setFilters} />

      {filteredEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 sm:py-12"
        >
          <p className="text-petsu-blue text-base sm:text-lg">No events found matching your filters.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}

      <Sheet>
        <SheetTrigger asChild>
          {cartItems.length > 0 && (
            <motion.div 
              className="fixed left-1/2 bottom-4 sm:bottom-8 -translate-x-1/2 bg-petsu-blue text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg cursor-pointer hover:bg-petsu-blue/90 transition-colors flex items-center gap-2 sm:gap-3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="font-semibold text-xs sm:text-sm">View Cart</span>
              <div className="flex items-center gap-1 sm:gap-2 border-l border-white/20 pl-2 sm:pl-3">
                <span className="text-xs sm:text-sm">{totalItems}</span>
                <span className="text-xs sm:text-sm hidden sm:inline">•</span>
                <span className="text-xs sm:text-sm">₹{totalAmount}</span>
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
