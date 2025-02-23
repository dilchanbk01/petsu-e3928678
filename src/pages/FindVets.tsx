
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";
import ConsultationRoom from "@/components/ConsultationRoom";
import ConsultationHero from "@/components/vet-consultation/ConsultationHero";
import SearchHeader from "@/components/vet-consultation/SearchHeader";
import ConsultationButtons from "@/components/vet-consultation/ConsultationButtons";
import VetList from "@/components/vet-consultation/VetList";
import type { VetWithAvailability } from "@/types/vet";

const FindVets = () => {
  const { session } = useAuth();
  const [showConsultation, setShowConsultation] = useState(false);
  const [selectedVetId, setSelectedVetId] = useState<string | null>(null);
  const [bannerData, setBannerData] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Unable to get your location. Showing all vets.");
        }
      );
    }
  }, []);

  const fetchVets = async (): Promise<VetWithAvailability[]> => {
    const { data: vets, error: vetsError } = await supabase
      .from('vets')
      .select('*')
      .eq('approval_status', 'approved');
    
    if (vetsError) throw vetsError;

    const { data: availability, error: availabilityError } = await supabase
      .from('vet_availability')
      .select('*');
    
    if (availabilityError) throw availabilityError;

    // Create some demo vets if none exist
    if (!vets?.length) {
      return [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          specialty: 'General Practice',
          experience: '8 years',
          location: 'New York',
          languages: ['English', 'Spanish'],
          consultation_fee: 50,
          rating: 4.8,
          image_url: '/lovable-uploads/c8691e4f-1095-4f6e-ae4b-a47d88f7384a.png',
          availability: { is_online: true, available_slots: [] }
        },
        {
          id: '2',
          name: 'Dr. Michael Chen',
          specialty: 'Surgery',
          experience: '12 years',
          location: 'San Francisco',
          languages: ['English', 'Mandarin'],
          consultation_fee: 75,
          rating: 4.9,
          image_url: '/lovable-uploads/c8691e4f-1095-4f6e-ae4b-a47d88f7384a.png',
          availability: { is_online: true, available_slots: [] }
        }
      ];
    }

    return vets.map(vet => ({
      ...vet,
      availability: availability?.find(a => a.vet_id === vet.id) || {
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
      if (!session) {
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

      const { data: consultationSession, error: sessionError } = await supabase
        .from('consultation_sessions')
        .insert({
          user_id: session.user.id,
          vet_id: onlineVet.id,
          status: 'pending',
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      await supabase
        .from('consultation_messages')
        .insert({
          session_id: consultationSession.id,
          sender_id: session.user.id,
          message_type: 'text',
          content: 'Started consultation',
        });

    } catch (error) {
      console.error('Consultation error:', error);
      toast.error("Failed to start consultation. Please try again.");
    }
  };

  const handleEndConsultation = async () => {
    try {
      if (selectedVetId) {
        await supabase
          .from('consultation_sessions')
          .update({ status: 'completed' })
          .eq('vet_id', selectedVetId)
          .eq('user_id', session?.user?.id)
          .eq('status', 'pending');
      }
      setShowConsultation(false);
      setSelectedVetId(null);
      toast.success("Consultation ended");
    } catch (error) {
      console.error('Error ending consultation:', error);
      toast.error("Failed to end consultation");
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
        <SearchHeader userLocation={userLocation} />
        
        <VetList vets={vets} isLoading={isLoading} />

        <ConsultationButtons 
          showConsultation={showConsultation}
          onStartConsultation={handleStartConsultation}
          onEndConsultation={handleEndConsultation}
        />
      </div>

      {showConsultation && selectedVetId && (
        <ConsultationRoom
          sessionId="temp-id"
          userId={session?.user?.id || ''}
          vetId={selectedVetId}
          onClose={handleEndConsultation}
        />
      )}
    </div>
  );
};

export default FindVets;
