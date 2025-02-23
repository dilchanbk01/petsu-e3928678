import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "@/utils/imageCompression";

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const compressedFile = await compressImage(file);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('vet-profiles')
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vet-profiles')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
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
        .select()
        .single();

      if (vetError) throw vetError;

      const { error: credError } = await supabase
        .from('vet_credentials')
        .insert({
          vet_id: vetData.id,
          email: formData.email,
          password_hash: await supabase.rpc('hash_vet_password', {
            password: formData.password
          })
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
      toast.error(error.message || "Failed to complete registration. Please try again.");
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
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <div className="flex items-center gap-4">
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Profile preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center border-dashed"
                  onClick={() => document.getElementById('imageUpload')?.click()}
                >
                  <Upload className="w-6 h-6 mb-2" />
                  Upload Photo
                </Button>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Dr. John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label>Specialty</Label>
              <Select
                value={formData.specialty}
                onValueChange={(value) => setFormData(prev => ({ ...prev, specialty: value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g., 5 years"
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, Country"
              />
            </div>

            <div className="space-y-2">
              <Label>Languages (comma-separated)</Label>
              <Input
                required
                value={formData.languages}
                onChange={(e) => setFormData(prev => ({ ...prev, languages: e.target.value }))}
                placeholder="English, Spanish, French"
              />
            </div>

            <div className="space-y-2">
              <Label>Consultation Fee (USD)</Label>
              <Input
                type="number"
                required
                value={formData.consultation_fee}
                onChange={(e) => setFormData(prev => ({ ...prev, consultation_fee: e.target.value }))}
                placeholder="50"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Choose a strong password"
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                required
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
                placeholder="Confirm your password"
              />
            </div>

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
