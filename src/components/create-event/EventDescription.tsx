
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EventDescriptionProps {
  description: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const EventDescription = ({ description, handleInputChange }: EventDescriptionProps) => {
  return (
    <div className="bg-white rounded-xl p-8">
      <h2 className="text-2xl font-bold text-petsu-blue mb-6">Event Description</h2>
      <Textarea 
        name="description"
        value={description}
        onChange={handleInputChange}
        placeholder="Describe your event in detail (e.g., What's happening, who should attend, special instructions, etc.)"
        className="min-h-[200px] border-2 border-petsu-blue/20"
      />
    </div>
  );
};
