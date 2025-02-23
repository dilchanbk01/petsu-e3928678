
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps { 
  onFilterChange: (filters: { 
    searchTerm: string; 
    dateFilter: string; 
    showFreeOnly: boolean;
    eventType: string;
  }) => void 
}

const FilterBar = ({ onFilterChange }: FilterBarProps) => {
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

export default FilterBar;
