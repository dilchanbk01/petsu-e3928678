import { useState } from 'react';
import { Event } from "@/types/event";
import EventList from "@/components/events/EventList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Events = () => {
  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Puppy Training Workshop",
      date: "2024-03-15",
      time: "10:00 AM",
      location: "Central Pet Park",
      description: "Learn essential puppy training techniques",
      price: 0,
      imageUrl: "/lovable-uploads/a6a449a5-6229-468c-b139-1e521c756165.png",
      available_tickets: 50,
      type: "training"
    },
    {
      id: "2",
      title: "Pet Adoption Drive",
      date: "2024-03-20",
      time: "11:00 AM",
      location: "City Animal Shelter",
      description: "Find your perfect furry companion",
      price: 0,
      imageUrl: "/lovable-uploads/0f7eef24-076a-498b-8b25-6693ba92d01c.png",
      available_tickets: 100,
      type: "adoption"
    },
    {
      id: "3",
      title: "Veterinary Health Camp",
      date: "2024-03-25",
      time: "9:00 AM",
      location: "PetSu Clinic",
      description: "Free health checkups for your pets",
      price: 0,
      imageUrl: "/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png",
      available_tickets: 75,
      type: "medical"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type);
  };

  const filteredEvents = events.filter(event => {
    const searchMatch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const typeMatch = selectedType ? event.type === selectedType : true;

    return searchMatch && typeMatch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-8 sm:py-12"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-petsu-blue">
          Upcoming Events
        </h1>
        <Input
          type="text"
          placeholder="Search events..."
          className="w-full sm:w-64 mt-2 sm:mt-0 border-petsu-blue focus-visible:ring-petsu-blue text-petsu-blue"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex flex-wrap justify-start gap-4 mb-6">
        <Button
          variant="outline"
          className={`border-2 border-petsu-blue text-petsu-blue hover:bg-petsu-blue/10 ${selectedType === null ? 'bg-petsu-blue/10' : ''}`}
          onClick={() => handleTypeFilter(null)}
        >
          All Events
        </Button>
        <Button
          variant="outline"
          className={`border-2 border-petsu-blue text-petsu-blue hover:bg-petsu-blue/10 ${selectedType === 'training' ? 'bg-petsu-blue/10' : ''}`}
          onClick={() => handleTypeFilter('training')}
        >
          Training
        </Button>
        <Button
          variant="outline"
          className={`border-2 border-petsu-blue text-petsu-blue hover:bg-petsu-blue/10 ${selectedType === 'adoption' ? 'bg-petsu-blue/10' : ''}`}
          onClick={() => handleTypeFilter('adoption')}
        >
          Adoption
        </Button>
        <Button
          variant="outline"
          className={`border-2 border-petsu-blue text-petsu-blue hover:bg-petsu-blue/10 ${selectedType === 'medical' ? 'bg-petsu-blue/10' : ''}`}
          onClick={() => handleTypeFilter('medical')}
        >
          Medical
        </Button>
      </div>

      <EventList events={filteredEvents} />
    </motion.div>
  );
};

export default Events;
