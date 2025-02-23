
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { VetWithAvailability } from "@/types/vet";
import { useQuery } from "@tanstack/react-query";
import ConsultationRoom from "@/components/ConsultationRoom";
import VetCard from "@/components/vet-consultation/VetCard";
import ConsultationHero from "@/components/vet-consultation/ConsultationHero";
import SearchHeader from "@/components/vet-consultation/SearchHeader";

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

      const onlineVet = vets.find(v => v.availability.is_online);
      if (!onlineVet) {
        toast.error("No vets are currently available");
        return;
      }

      setSelectedVetId(onlineVet.id);
      setShowConsultation(true);

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
      <ConsultationHero
        imageUrl={bannerData?.image_url}
        title={bannerData?.title}
        subtitle={bannerData?.subtitle}
      />

      <div className="container mx-auto px-4 py-8">
        <SearchHeader />

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
          sessionId="temp-id"
          userId="temp-user-id"
          vetId={selectedVetId}
          onClose={() => setShowConsultation(false)}
        />
      )}
    </div>
  );
};

export default FindVets;
