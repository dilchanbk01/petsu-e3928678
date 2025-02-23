import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Search, Plus, Trash2, Filter } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventCard from "@/components/events/EventCard";
import { Event } from "@/types/event";

interface CartItem {
  eventId: string;
  title: string;
  date: string;
  time: string;
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
    imageUrl: "/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png",
    availableTickets: 50,
    type: "Adoption"
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
    availableTickets: 20,
    type: "Training"
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
    availableTickets: 100,
    type: "Health"
  }
];

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
          className="w-full p-4 flex items-center justify-between text-petsu-blue hover:bg-white/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <h2 className="font-semibold">Filter Events</h2>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-5 h-5 rotate-90" />
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

const Events = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : sampleEvents;
  });
  
  const [filters, setFilters] = useState({
    searchTerm: "",
    dateFilter: "all",
    showFreeOnly: false,
    eventType: "all"
  });

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
        <Link to="/create-event">
          <button className="flex items-center gap-2 bg-petsu-blue text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Create Event</span>
          </button>
        </Link>
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
