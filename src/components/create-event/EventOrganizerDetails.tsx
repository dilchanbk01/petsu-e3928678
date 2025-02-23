
import { Phone, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EventOrganizerDetailsProps {
  formData: {
    organizerName: string;
    phone: string;
    email: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EventOrganizerDetails = ({ formData, handleInputChange }: EventOrganizerDetailsProps) => {
  return (
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
  );
};
