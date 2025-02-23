
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoFormProps {
  formData: {
    name: string;
    specialty: string;
    experience: string;
    location: string;
    languages: string;
    consultation_fee: string;
  };
  onChange: (field: string, value: string) => void;
}

export const BasicInfoForm = ({ formData, onChange }: BasicInfoFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input
          required
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Dr. John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label>Specialty</Label>
        <Select
          value={formData.specialty}
          onValueChange={(value) => onChange('specialty', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="General Veterinary">General Veterinary</SelectItem>
            <SelectItem value="Surgery">Surgery</SelectItem>
            <SelectItem value="Dermatology">Dermatology</SelectItem>
            <SelectItem value="Cardiology">Cardiology</SelectItem>
            <SelectItem value="Dentistry">Dentistry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Experience</Label>
        <Input 
          required
          value={formData.experience}
          onChange={(e) => onChange('experience', e.target.value)}
          placeholder="e.g., 5 years"
        />
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          required
          value={formData.location}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="City, Country"
        />
      </div>

      <div className="space-y-2">
        <Label>Languages (comma-separated)</Label>
        <Input
          required
          value={formData.languages}
          onChange={(e) => onChange('languages', e.target.value)}
          placeholder="English, Spanish, French"
        />
      </div>

      <div className="space-y-2">
        <Label>Consultation Fee (USD)</Label>
        <Input
          type="number"
          required
          value={formData.consultation_fee}
          onChange={(e) => onChange('consultation_fee', e.target.value)}
          placeholder="50"
        />
      </div>
    </>
  );
};
