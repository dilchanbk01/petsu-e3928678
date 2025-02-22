
import { motion } from "framer-motion";
import { ArrowLeft, Search, Star, MapPin, Video, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VetProfile {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  location: string;
  imageUrl: string;
  available: boolean;
}

const vets: VetProfile[] = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialty: "Small Animals & Exotic Pets",
    rating: 4.9,
    location: "New York, USA",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    available: true,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Dogs & Cats Specialist",
    rating: 4.8,
    location: "Los Angeles, USA",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    available: true,
  },
  {
    id: 3,
    name: "Dr. Emily Brown",
    specialty: "Animal Nutrition Expert",
    rating: 4.7,
    location: "Chicago, USA",
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    available: false,
  }
];

const VetCard = ({ vet }: { vet: VetProfile }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
  >
    <div className="p-6">
      <div className="flex items-start gap-4">
        <img
          src={vet.imageUrl}
          alt={vet.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{vet.name}</h3>
          <p className="text-gray-600">{vet.specialty}</p>
          <div className="flex items-center mt-2 text-gray-500">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1">{vet.rating}</span>
          </div>
          <div className="flex items-center mt-1 text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="ml-1 text-sm">{vet.location}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button 
          className="flex-1 bg-petsu-yellow hover:bg-petsu-yellow/90 text-petsu-blue"
          disabled={!vet.available}
        >
          <Video className="w-4 h-4 mr-2" />
          Video Call
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 border-petsu-blue text-petsu-blue hover:bg-petsu-yellow/10"
          disabled={!vet.available}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat
        </Button>
      </div>
    </div>
  </motion.div>
);

const FindVets = () => {
  return (
    <div className="min-h-screen p-8">
      <Link to="/">
        <motion.div
          className="flex items-center text-petsu-yellow mb-8 hover:text-petsu-blue transition-colors"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span className="text-xl font-semibold">Back to Home</span>
        </motion.div>
      </Link>
      
      <motion.h1 
        className="text-4xl font-bold text-petsu-yellow mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Online Vet Consultation
      </motion.h1>
      
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-md">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for veterinarians by name or specialty..."
              className="pl-10 border-gray-200"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {vets.map((vet) => (
            <VetCard key={vet.id} vet={vet} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FindVets;
