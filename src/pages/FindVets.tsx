
import { motion } from "framer-motion";
import { ArrowLeft, Search, Star, MapPin, Video, MessageSquare, Calendar, Circle, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface VetProfile {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  location: string;
  imageUrl: string;
  available: boolean;
  availableSlots: string[];
  isOnline: boolean;
  consultationFee: number;
  languages: string[];
  experience: string;
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
    availableSlots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
    isOnline: true,
    consultationFee: 75,
    languages: ["English", "Spanish"],
    experience: "12 years"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Dogs & Cats Specialist",
    rating: 4.8,
    location: "Los Angeles, USA",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    available: true,
    availableSlots: ["10:00 AM", "1:00 PM", "3:00 PM"],
    isOnline: false,
    consultationFee: 65,
    languages: ["English", "Mandarin"],
    experience: "8 years"
  },
  {
    id: 3,
    name: "Dr. Emily Brown",
    specialty: "Animal Nutrition Expert",
    rating: 4.7,
    location: "Chicago, USA",
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    available: false,
    availableSlots: [],
    isOnline: false,
    consultationFee: 70,
    languages: ["English"],
    experience: "15 years"
  }
];

interface VetCardProps {
  vet: VetProfile;
}

const ConsultationDetails = ({ 
  selectedSlot, 
  consultationFee,
  onConfirm 
}: { 
  selectedSlot: string;
  consultationFee: number;
  onConfirm: () => void;
}) => (
  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
    <h3 className="font-semibold text-lg mb-4">Consultation Details</h3>
    <div className="space-y-2 mb-4">
      <div className="flex justify-between">
        <span>Appointment Time:</span>
        <span className="font-medium">{selectedSlot}</span>
      </div>
      <div className="flex justify-between">
        <span>Consultation Fee:</span>
        <span className="font-medium">${consultationFee}</span>
      </div>
    </div>
    <Button 
      onClick={onConfirm}
      className="w-full bg-petsu-yellow hover:bg-petsu-yellow/90 text-petsu-blue"
    >
      <Check className="w-4 h-4 mr-2" />
      Confirm Booking
    </Button>
  </div>
);

const VetCard = ({ vet }: VetCardProps) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);

  const handleBook = () => {
    if (selectedSlot) {
      setIsBooked(true);
      toast.success("Appointment booked successfully!");
      // Here you would typically make an API call to save the appointment
    }
  };

  const handleStartConsultation = () => {
    setShowConsultation(true);
    // In a real app, this would initialize the video call
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={vet.imageUrl}
              alt={vet.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className={`absolute bottom-0 right-0 p-1 rounded-full ${vet.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}>
              <Circle className="w-3 h-3 fill-white text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">{vet.name}</h3>
              <span className={`text-sm px-2 py-1 rounded ${vet.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {vet.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-gray-600">{vet.specialty}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center text-gray-500">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1">{vet.rating}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="ml-1 text-sm">{vet.location}</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>Experience: {vet.experience}</p>
              <p>Languages: {vet.languages.join(", ")}</p>
              <p>Consultation Fee: ${vet.consultationFee}</p>
            </div>
          </div>
        </div>

        {!isBooked ? (
          <div className="mt-4">
            {vet.isOnline ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    className="w-full mb-4 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Start Immediate Consultation
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Start Consultation</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Consultation Fee</h3>
                        <p className="text-2xl font-bold text-petsu-blue">${vet.consultationFee}</p>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-petsu-yellow hover:bg-petsu-yellow/90 text-petsu-blue"
                          onClick={handleStartConsultation}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Start Video Call
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-petsu-blue text-petsu-blue hover:bg-petsu-yellow/10"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Start Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-petsu-blue" />
                  <span className="font-medium text-petsu-blue">Available Slots</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {vet.availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant="outline"
                      className={`${
                        selectedSlot === slot
                          ? "bg-petsu-yellow text-petsu-blue border-petsu-blue"
                          : "hover:bg-petsu-yellow/10"
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
                {selectedSlot && (
                  <ConsultationDetails
                    selectedSlot={selectedSlot}
                    consultationFee={vet.consultationFee}
                    onConfirm={handleBook}
                  />
                )}
              </>
            )}
          </div>
        ) : (
          <div className="mt-6">
            <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 font-medium">
                Appointment booked for {selectedSlot}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-petsu-yellow hover:bg-petsu-yellow/90 text-petsu-blue"
              >
                <Video className="w-4 h-4 mr-2" />
                Join Call
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-petsu-blue text-petsu-blue hover:bg-petsu-yellow/10"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

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
