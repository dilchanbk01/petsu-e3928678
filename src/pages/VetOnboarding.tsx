
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/vet-onboarding/ImageUpload";
import { BasicInfoForm } from "@/components/vet-onboarding/BasicInfoForm";
import { CredentialsForm } from "@/components/vet-onboarding/CredentialsForm";

const VetOnboarding = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    experience: "",
    location: "",
    languages: "",
    consultation_fee: "",
    image_url: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const { data: vetData, error: vetError } = await supabase
        .from('vets')
        .insert({
          name: formData.name,
          specialty: formData.specialty,
          experience: formData.experience,
          location: formData.location,
          languages: formData.languages.split(',').map(lang => lang.trim()),
          consultation_fee: parseInt(formData.consultation_fee),
          image_url: formData.image_url,
          approval_status: 'pending',
        })
        .select('id')
        .single();

      if (vetError) throw vetError;

      if (!vetData?.id) {
        throw new Error('Failed to create vet profile');
      }

      const { data: hashedPassword, error: hashError } = await supabase
        .rpc('hash_vet_password', {
          password: formData.password
        });

      if (hashError) throw hashError;

      const { error: credError } = await supabase
        .from('vet_credentials')
        .insert({
          vet_id: vetData.id,
          email: formData.email,
          password_hash: hashedPassword
        });

      if (credError) throw credError;

      await supabase
        .from('vet_availability')
        .insert({
          vet_id: vetData.id,
          is_online: false,
        });

      toast.success("Registration successful! Your profile is pending approval.");
      navigate('/vet-auth');
    } catch (error: any) {
      console.error("Error registering vet:", error);
      if (error.message.includes('duplicate key')) {
        toast.error("This email is already registered");
      } else {
        toast.error(error.message || "Failed to complete registration. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mb-8">
        <Link to="/">
          <motion.div
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border-2 border-petsu-blue hover:bg-petsu-yellow/20 transition-all duration-300"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5 text-petsu-blue" />
          </motion.div>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-petsu-yellow mb-6">
          Join Our Veterinary Network
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ImageUpload 
              imageUrl={formData.image_url}
              onImageUpload={(url) => handleFormChange('image_url', url)}
            />

            <BasicInfoForm 
              formData={formData}
              onChange={handleFormChange}
            />

            <CredentialsForm 
              formData={formData}
              onChange={handleFormChange}
            />

            <Button
              type="submit"
              className="w-full bg-petsu-blue hover:bg-petsu-blue/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Complete Registration"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default VetOnboarding;
