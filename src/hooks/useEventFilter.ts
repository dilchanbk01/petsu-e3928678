
import { useState } from 'react';
import { Event } from '@/types/event';

interface FilterState {
  searchTerm: string;
  dateFilter: string;
  showFreeOnly: boolean;
  eventType: string;
}

export const useEventFilter = (events: Event[]) => {
  const [filters, setFilters] = useState<FilterState>({
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

  return {
    filters,
    setFilters,
    filteredEvents
  };
};
