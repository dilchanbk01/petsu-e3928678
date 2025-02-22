
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Calendar, Clock, MapPin, Users, Phone, Mail, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const CreateEvent = () => {
  const [isFreeEvent, setIsFreeEvent] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
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
        <div className="bg-petsu-yellow rounded-xl p-8 text-center cursor-pointer hover:bg-petsu-yellow/90 transition-colors">
          <Image className="w-12 h-12 mx-auto mb-4 text-petsu-blue" />
          <p className="text-petsu-blue font-semibold">Click to upload event banner</p>
          <p className="text-petsu-blue/60 text-sm">Recommended size: 1200x600px</p>
          <input type="file" className="hidden" accept="image/*" />
        </div>

        {/* Basic Event Details */}
        <div className="bg-white rounded-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-petsu-blue mb-6">Event Details</h2>
          
          <div className="space-y-4">
            <div>
              <Label className="text-petsu-blue">Event Name</Label>
              <Input 
                placeholder="Enter event title (e.g., Puppy Training Workshop)" 
                className="border-2 border-petsu-blue/20 focus:border-petsu-blue"
              />
            </div>

            <div>
              <Label className="text-petsu-blue">Event Type</Label>
              <Select>
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
                  <Input type="date" className="pl-10 border-2 border-petsu-blue/20" />
                </div>
              </div>
              <div>
                <Label className="text-petsu-blue">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-petsu-blue/60 w-5 h-5" />
                  <Input type="time" className="pl-10 border-2 border-petsu-blue/20" />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-petsu-blue">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-petsu-blue/60 w-5 h-5" />
                <Input 
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
                  placeholder="Enter maximum capacity (optional)"
                  className="pl-10 border-2 border-petsu-blue/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-petsu-blue">Free Event</Label>
              <Switch 
                checked={isFreeEvent}
                onCheckedChange={setIsFreeEvent}
              />
            </div>

            {!isFreeEvent && (
              <div>
                <Label className="text-petsu-blue">Ticket Price (₹)</Label>
                <Input 
                  type="number" 
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
