import { motion } from "framer-motion";
import { ArrowLeft, Search, Star, MapPin, Video, MessageSquare, Calendar, Circle, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { VetWithAvailability } from "@/types/vet";
import { useQuery } from "@tanstack/react-query";

interface ConsultationDetailsProps { 
  selectedSlot: string;
  consultationFee: number;
  onConfirm: (sessionType: 'video' | 'chat') => Promise<void>;
  isLoading: boolean;
}

const ConsultationDetails = ({ 
  selectedSlot, 
  consultationFee,
  onConfirm,
  isLoading
}: ConsultationDetailsProps) => (
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
    <div className="flex gap-3">
      <Button 
        disabled={isLoading}
        onClick={() => onConfirm('video')}
        className="flex-1 bg-petsu-yellow hover:bg-petsu-yellow/90 text-petsu-blue"
      >
        <Video className="w-4 h-4 mr-2" />
        Book Video Call
      </Button>
      <Button 
        disabled={isLoading}
        onClick={() => onConfirm('chat')}
        variant="outline" 
        className="flex-1 border-petsu-blue text-petsu-blue hover:bg-petsu-yellow/10"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Book Chat
      </Button>
    </div>
  </div>
);

const VetCard = ({ vet }: { vet: VetWithAvailability }) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleBook = async (sessionType: 'video' | 'chat') => {
    if (!selectedSlot) return;

    setIsBooking(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast.error("Please log in to book an appointment");
        return;
      }

      const appointmentTime = new Date();
      const [hours, minutes] = selectedSlot.split(':');
      appointmentTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { error } = await supabase
        .from('appointments')
        .insert({
          vet_id: vet.id,
          user_id: user.id,
          appointment_time: appointmentTime.toISOString(),
          amount: vet.consultation_fee,
          session_type: sessionType,
        });

      if (error) throw error;

      setIsBooked(true);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.error('Booking error:', error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleStartConsultation = async (sessionType: 'video' | 'chat') => {
    setShowConsultation(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast.error("Please log in to start a consultation");
        return;
      }

      const { error } = await supabase
        .from('appointments')
        .insert({
          vet_id: vet.id,
          user_id: user.id,
          appointment_time: new Date().toISOString(),
          amount: vet.consultation_fee,
          session_type: sessionType,
          status: 'confirmed',
        });

      if (error) throw error;
      
      toast.success(`Starting ${sessionType} consultation...`);
    } catch (error) {
      console.error('Consultation error:', error);
      toast.error("Failed to start consultation. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="relative p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img
              src={vet.image_url || '/public/lovable-uploads/c8691e4f-1095-4f6e-ae4b-a47d88f7384a.png'}
              alt={vet.name}
              className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
            />
            <div className={`absolute bottom-0 right-0 p-1 rounded-full ${
              vet.availability.is_online ? 'bg-green-500' : 'bg-gray-400'
            }`}>
              <Circle className="w-3 h-3 fill-white text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{vet.name}</h3>
              <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold">{vet.rating}</span>
              </div>
            </div>
            
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{vet.location} • {vet.experience}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <div className="flex items-center">
                  {vet.specialty.split(',').map((specialty, index) => (
                    <span key={index} className="mr-4 text-sm">
                      {specialty.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="text-sm">Languages: {vet.languages.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Consultation Fee</span>
            <span className="text-lg font-bold text-petsu-blue">${vet.consultation_fee}</span>
          </div>
        </div>

        {!isBooked ? (
          <div className="mt-4">
            {vet.availability.is_online ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    className="w-full bg-petsu-blue hover:bg-petsu-blue/90 text-white"
                  >
                    View Details & Book Now
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
                        <p className="text-2xl font-bold text-petsu-blue">${vet.consultation_fee}</p>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-petsu-yellow hover:bg-petsu-yellow/90 text-petsu-blue"
                          onClick={() => handleStartConsultation('video')}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Start Video Call
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-petsu-blue text-petsu-blue hover:bg-petsu-yellow/10"
                          onClick={() => handleStartConsultation('chat')}
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
                <div className="flex items-center gap-2 mb-3 mt-4">
                  <Calendar className="w-4 h-4 text-petsu-blue" />
                  <span className="font-medium text-petsu-blue">Available Slots</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {vet.availability.available_slots.map((slot) => (
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
                    consultationFee={vet.consultation_fee}
                    onConfirm={handleBook}
                    isLoading={isBooking}
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
  const fetchVets = async () => {
    const { data: vets, error: vetsError } = await supabase
      .from('vets')
      .select('*');
    
    if (vetsError) throw vetsError;

    const { data: availability, error: availabilityError } = await supabase
      .from('vet_availability')
      .select('*');
    
    if (availabilityError) throw availabilityError;

    return vets.map(vet => ({
      ...vet,
      availability: availability.find(a => a.vet_id === vet.id) || {
        is_online: false,
        available_slots: []
      }
    }));
  };

  const { data: vets = [], isLoading } = useQuery({
    queryKey: ['vets'],
    queryFn: fetchVets
  });

  useEffect(() => {
    const channel = supabase.channel('realtime-vets')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vet_availability' },
        (payload) => {
          console.log('Realtime update:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <Link to="/">
          <motion.div
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border-2 border-petsu-blue hover:bg-petsu-yellow/20 transition-all duration-300"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5 text-petsu-blue" />
          </motion.div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-petsu-blue/60 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border-2 border-petsu-blue bg-white text-petsu-blue placeholder-petsu-blue/60 focus:outline-none focus:ring-2 focus:ring-petsu-blue"
            />
          </div>
        </div>
      </div>

      <motion.h1 
        className="text-2xl font-bold text-petsu-yellow mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Online Vet Consultation
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
        {isLoading ? (
          <div className="text-center py-8">Loading vets...</div>
        ) : (
          vets.map((vet) => (
            <VetCard key={vet.id} vet={vet} />
          ))
        )}
      </div>

      <div className="mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-petsu-blue to-petsu-blue/80 rounded-2xl p-6 md:p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Are you a veterinarian?</h2>
              <p className="text-white/90 mb-4">Join our network of professional vets and connect with pet owners.</p>
              <Link to="/vet-onboarding">
                <Button className="bg-white text-petsu-blue hover:bg-petsu-yellow">
                  Join as a Vet Partner
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <img 
                src="/lovable-uploads/c8691e4f-1095-4f6e-ae4b-a47d88f7384a.png" 
                alt="Vet Partner" 
                className="w-48 h-48 object-contain"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FindVets;
