import { motion } from "framer-motion";
import { ArrowLeft, Upload, Calendar, Clock, MapPin, Users, Phone, Mail, Image } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { compressImage } from "@/utils/imageCompression";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFreeEvent, setIsFreeEvent] = useState(true);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.date || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Get existing events from localStorage or initialize empty array
    const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    // Create new event object
    const newEvent = {
      id: Date.now().toString(),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      description: formData.description,
      price: isFreeEvent ? 0 : parseInt(formData.price) || 0,
      imageUrl: formData.imageUrl || "/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png"
    };

    // Add new event to array and save back to localStorage
    const updatedEvents = [...existingEvents, newEvent];
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    // Show success message
    toast({
      title: "Success!",
      description: "Your event has been created successfully.",
    });

    // Navigate back to events page
    navigate('/events');
  };

  return (
    <div className="min-h-screen p-8 pb-24">
      {/* Header */}
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
        className="max-w-4xl mx-auto space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Event Banner Upload */}
        <div 
          className="bg-petsu-yellow rounded-xl p-8 text-center cursor-pointer hover:bg-petsu-yellow/90 transition-colors relative"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewImage ? (
            <div className="relative">
              <img 
                src={previewImage} 
                alt="Event preview" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                <p className="text-white">Click to change image</p>
              </div>
            </div>
          ) : (
            <>
              <Image className="w-12 h-12 mx-auto mb-4 text-petsu-blue" />
              <p className="text-petsu-blue font-semibold">Click to upload event banner</p>
              <p className="text-petsu-blue/60 text-sm">Recommended size: 1200x600px</p>
            </>
          )}
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        {/* Basic Event Details */}
        <div className="bg-white rounded-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-petsu-blue mb-6">Event Details</h2>
          
          <div className="space-y-4">
            <div>
              <Label className="text-petsu-blue">Event Name</Label>
              <Input 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title (e.g., Puppy Training Workshop)" 
                className="border-2 border-petsu-blue/20 focus:border-petsu-blue"
              />
            </div>

            <div>
              <Label className="text-petsu-blue">Event Type</Label>
              <Select name="type" onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="border-2 border-petsu-blue/20">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="adoption">Adoption</SelectItem>
                  <SelectItem value="social">Social Meetup</SelectItem>
                  <SelectItem value="medical">Medical Camp</SelectItem>
                  <SelectItem value="charity">Charity Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-petsu-blue">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-petsu-blue/60 w-5 h-5" />
                  <Input 
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="pl-10 border-2 border-petsu-blue/20" 
                  />
                </div>
              </div>
              <div>
                <Label className="text-petsu-blue">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-petsu-blue/60 w-5 h-5" />
                  <Input 
                    type="time" 
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="pl-10 border-2 border-petsu-blue/20" 
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-petsu-blue">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-petsu-blue/60 w-5 h-5" />
                <Input 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter event location" 
                  className="pl-10 border-2 border-petsu-blue/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Event Description */}
        <div className="bg-white rounded-xl p-8">
          <h2 className="text-2xl font-bold text-petsu-blue mb-6">Event Description</h2>
          <Textarea 
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your event in detail (e.g., What's happening, who should attend, special instructions, etc.)"
            className="min-h-[200px] border-2 border-petsu-blue/20"
          />
        </div>

        {/* Capacity & Pricing */}
        <div className="bg-white rounded-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-petsu-blue mb-6">Capacity & Pricing</h2>
          
          <div className="space-y-4">
            <div>
              <Label className="text-petsu-blue">Maximum Participants</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-petsu-blue/60 w-5 h-5" />
                <Input 
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  placeholder="Enter maximum capacity (optional)"
                  className="pl-10 border-2 border-petsu-blue/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-petsu-blue">Free Event</Label>
              <Switch 
                checked={isFreeEvent}
                onCheckedChange={(checked) => {
                  setIsFreeEvent(checked);
                  setFormData(prev => ({ ...prev, isFreeEvent: checked }));
                }}
              />
            </div>

            {!isFreeEvent && (
              <div>
                <Label className="text-petsu-blue">Ticket Price (₹)</Label>
                <Input 
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price per person"
                  className="border-2 border-petsu-blue/20"
                />
              </div>
            )}
          </div>
        </div>

        {/* Organizer Details */}
        <div className="bg-white rounded-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-petsu-blue mb-6">Organizer Details</h2>
          
          <div className="space-y-4">
            <div>
              <Label className="text-petsu-blue">Organizer Name</Label>
              <Input 
                name="organizerName"
                value={formData.organizerName}
                onChange={handleInputChange}
                placeholder="Enter organizer name"
                className="border-2 border-petsu-blue/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-petsu-blue">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-petsu-blue/60 w-5 h-5" />
                  <Input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="pl-10 border-2 border-petsu-blue/20"
                  />
                </div>
              </div>
              <div>
                <Label className="text-petsu-blue">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-petsu-blue/60 w-5 h-5" />
                  <Input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="pl-10 border-2 border-petsu-blue/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
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
