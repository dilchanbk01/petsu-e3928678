
import { Calendar, Clock, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventBasicDetailsProps {
  formData: {
    title: string;
    type: string;
    date: string;
    time: string;
    location: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (value: string) => void;
}

export const EventBasicDetails = ({ formData, handleInputChange, onTypeChange }: EventBasicDetailsProps) => {
  return (
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
          <Select name="type" onValueChange={onTypeChange}>
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
  );
};
