
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { compressImage } from "@/utils/imageCompression";
import { EventBanner } from "@/components/create-event/EventBanner";
import { EventBasicDetails } from "@/components/create-event/EventBasicDetails";
import { EventDescription } from "@/components/create-event/EventDescription";
import { EventCapacityPricing } from "@/components/create-event/EventCapacityPricing";
import { EventOrganizerDetails } from "@/components/create-event/EventOrganizerDetails";

interface EventFormData {
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  maxParticipants: string;
  isFreeEvent: boolean;
  price: string;
  organizerName: string;
  phone: string;
  email: string;
  imageUrl: string;
}

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<string>("");
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    type: "",
    date: "",
    time: "",
    location: "",
    description: "",
    maxParticipants: "",
    isFreeEvent: true,
    price: "",
    organizerName: "",
    phone: "",
    email: "",
    imageUrl: ""
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          setPreviewImage(imageUrl);
          setFormData(prev => ({ ...prev, imageUrl }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        toast({
          title: "Error",
          description: "Failed to process image. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    const newEvent = {
      id: Date.now().toString(),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      description: formData.description,
      price: formData.isFreeEvent ? 0 : parseInt(formData.price) || 0,
      imageUrl: formData.imageUrl || "/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png",
      available_tickets: parseInt(formData.maxParticipants) || 100
    };

    const updatedEvents = [...existingEvents, newEvent];
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    toast({
      title: "Success!",
      description: "Your event has been created successfully.",
    });

    navigate('/events');
  };

  return (
    <div className="min-h-screen p-8 pb-24">
      <Link to="/events">
        <motion.div
          className="flex items-center text-petsu-yellow hover:text-petsu-blue transition-colors mb-8"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span className="text-xl font-semibold">Back to Events</span>
        </motion.div>
      </Link>

      <motion.h1 
        className="text-4xl font-bold text-petsu-yellow mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Create a New Event
      </motion.h1>

      <motion.form 
        onSubmit={handleSubmit}
        className="max

w-4xl mx-auto space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <EventBanner 
          previewImage={previewImage}
          onImageUpload={handleImageUpload}
        />

        <EventBasicDetails 
          formData={formData}
          handleInputChange={handleInputChange}
          onTypeChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
        />

        <EventDescription 
          description={formData.description}
          handleInputChange={handleInputChange}
        />

        <EventCapacityPricing 
          formData={formData}
          handleInputChange={handleInputChange}
          onFreeEventChange={(checked) => setFormData(prev => ({ ...prev, isFreeEvent: checked }))}
        />

        <EventOrganizerDetails 
          formData={formData}
          handleInputChange={handleInputChange}
        />

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-3 rounded-lg bg-petsu-yellow text-petsu-blue font-semibold hover:opacity-90 transition-opacity"
          >
            Preview Event
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-petsu-blue text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Submit Event
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default CreateEvent;
