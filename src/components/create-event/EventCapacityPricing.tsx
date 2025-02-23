
import { Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface EventCapacityPricingProps {
  formData: {
    maxParticipants: string;
    price: string;
    isFreeEvent: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFreeEventChange: (checked: boolean) => void;
}

export const EventCapacityPricing = ({ 
  formData, 
  handleInputChange, 
  onFreeEventChange 
}: EventCapacityPricingProps) => {
  return (
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
            checked={formData.isFreeEvent}
            onCheckedChange={onFreeEventChange}
          />
        </div>

        {!formData.isFreeEvent && (
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
  );
};
