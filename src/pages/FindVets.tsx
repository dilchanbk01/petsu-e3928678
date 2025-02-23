
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Star, MapPin, MessageSquare, Circle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { VetWithAvailability } from "@/types/vet";
import { useQuery } from "@tanstack/react-query";
import ConsultationRoom from "@/components/ConsultationRoom";

const VetCard = ({ vet }: { vet: VetWithAvailability }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={vet.image_url || '/lovable-uploads/c8691e4f-1095-4f6e-ae4b-a47d88f7384a.png'}
              alt={vet.name}
              className="w-16 h-16 object-cover rounded-full border-2 border-white shadow"
            />
            <div className={`absolute bottom-0 right-0 p-1 rounded-full ${
              vet.availability.is_online ? 'bg-green-500' : 'bg-gray-400'
            }`}>
              <Circle className="w-2 h-2 fill-white text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{vet.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{vet.rating}</span>
              </div>
            </div>
            
            <div className="mt-1 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{vet.location}</span>
              </div>
              <div className="mt-1">
                {vet.specialty.split(',')[0]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FindVets = () => {
  const [showConsultation, setShowConsultation] = useState(false);
  const [selectedVetId, setSelectedVetId] = useState<string | null>(null);
  const [bannerData, setBannerData] = useState<any>(null);

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

  const fetchBanner = async () => {
    const { data, error } = await supabase
      .from('dynamic_content')
      .select('*')
      .eq('type', 'vet_consultation_banner')
      .single();

    if (!error && data) {
      setBannerData(data.content);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const { data: vets = [], isLoading } = useQuery({
    queryKey: ['vets'],
    queryFn: fetchVets
  });

  const handleStartConsultation = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast.error("Please log in to start a consultation");
        return;
      }

      // Find the first available vet
      const onlineVet = vets.find(v => v.availability.is_online);
      if (!onlineVet) {
        toast.error("No vets are currently available");
        return;
      }

      setSelectedVetId(onlineVet.id);
      setShowConsultation(true);

      // Create a consultation session
      const { data: session, error: sessionError } = await supabase
        .from('consultation_sessions')
        .insert({
          user_id: user.id,
          vet_id: onlineVet.id,
          status: 'pending',
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Add initial message
      await supabase
        .from('consultation_messages')
        .insert({
          session_id: session.id,
          sender_id: user.id,
          message_type: 'text',
          content: 'Started consultation',
        });

    } catch (error) {
      console.error('Consultation error:', error);
      toast.error("Failed to start consultation. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div 
        className="relative h-[300px] bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${bannerData?.image_url || '/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png'})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-petsu-blue/80 to-transparent">
          <div className="container mx-auto h-full flex items-center">
            <div className="max-w-2xl text-white p-8">
              <h1 className="text-4xl font-bold mb-4">
                {bannerData?.title || "Instant Vet Consultation"}
              </h1>
              <p className="text-xl">
                {bannerData?.subtitle || "Connect with licensed veterinarians 24/7"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <motion.div
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border-2 border-petsu-blue hover:bg-petsu-yellow/20 transition-all duration-300"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-5 h-5 text-petsu-blue" />
            </motion.div>
          </Link>
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-petsu-blue/60 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border-2 border-petsu-blue bg-white text-petsu-blue placeholder-petsu-blue/60 focus:outline-none focus:ring-2 focus:ring-petsu-blue"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            <div className="text-center py-8">Loading vets...</div>
          ) : (
            vets.map((vet) => (
              <VetCard key={vet.id} vet={vet} />
            ))
          )}
        </div>

        <div className="flex justify-center">
          <Button 
            size="lg"
            className="bg-petsu-blue hover:bg-petsu-blue/90 text-white"
            onClick={handleStartConsultation}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Start Instant Consultation
          </Button>
        </div>
      </div>

      {showConsultation && selectedVetId && (
        <ConsultationRoom
          sessionId="temp-id" // This should come from the created session
          userId="temp-user-id" // This should come from auth
          vetId={selectedVetId}
          onClose={() => setShowConsultation(false)}
        />
      )}
    </div>
  );
};

export default FindVets;
