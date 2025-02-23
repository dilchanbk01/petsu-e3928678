
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Star, MapPin, Video, MessageSquare, Calendar, Circle, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
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
        Start Video Call
      </Button>
      <Button 
        disabled={isLoading}
        onClick={() => onConfirm('chat')}
        variant="outline" 
        className="flex-1 border-petsu-blue text-petsu-blue hover:bg-petsu-yellow/10"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Start Chat
      </Button>
    </div>
  </div>
);

const VetCard = ({ vet }: { vet: VetWithAvailability }) => {
  const [showConsultation, setShowConsultation] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleStartConsultation = async (sessionType: 'video' | 'chat') => {
    setShowConsultation(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast.error("Please log in to start a consultation");
        return;
      }

      // Create a consultation session
      const { data: session, error: sessionError } = await supabase
        .from('consultation_sessions')
        .insert({
          user_id: user.id,
          vet_id: vet.id,
          status: 'pending',
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Add initial message
      const { error: messageError } = await supabase
        .from('consultation_messages')
        .insert({
          session_id: session.id,
          sender_id: user.id,
          message_type: 'text',
          content: `Started ${sessionType} consultation`,
        });

      if (messageError) throw messageError;
      
      toast.success(`Starting ${sessionType} consultation...`);
      // Here you would typically navigate to a consultation room component
      // We'll implement that in the next step
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

        {vet.availability.is_online ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                className="w-full mt-4 bg-petsu-blue hover:bg-petsu-blue/90 text-white"
              >
                Start Instant Consultation
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
          <Button
            variant="outline"
            className="w-full mt-4 border-gray-300 text-gray-500"
            disabled
          >
            Currently Offline
          </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {isLoading ? (
          <div className="text-center py-8">Loading vets...</div>
        ) : (
          vets.map((vet) => (
            <VetCard key={vet.id} vet={vet} />
          ))
        )}
      </div>
    </div>
  );
};

export default FindVets;
