
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CredentialsFormProps {
  formData: {
    email: string;
    password: string;
    confirm_password: string;
  };
  onChange: (field: string, value: string) => void;
}

export const CredentialsForm = ({ formData, onChange }: CredentialsFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          required
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="your@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <Input
          required
          type="password"
          value={formData.password}
          onChange={(e) => onChange('password', e.target.value)}
          placeholder="Choose a strong password"
        />
      </div>

      <div className="space-y-2">
        <Label>Confirm Password</Label>
        <Input
          required
          type="password"
          value={formData.confirm_password}
          onChange={(e) => onChange('confirm_password', e.target.value)}
          placeholder="Confirm your password"
        />
      </div>
    </>
  );
};
