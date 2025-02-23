
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  email: string;
  password: string;
}

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error when user starts typing
    if (errors[id as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    
    setIsLoading(true);

    try {
      // First verify admin credentials
      const { data: isValidAdmin, error: verifyError } = await supabase
        .rpc('verify_admin_password', {
          email: formData.email,
          password: formData.password
        });

      if (verifyError) {
        throw new Error(verifyError.message || "Failed to verify admin credentials");
      }

      if (!isValidAdmin) {
        throw new Error("Invalid admin credentials");
      }

      // Then sign in with Supabase Auth
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (!signInData.user) {
        throw new Error("No user data returned after sign in");
      }

      toast.success("Welcome back, admin!");
      navigate("/admin");
    } catch (error) {
      console.error("Admin auth error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
      // Reset password field on error
      setFormData(prev => ({ ...prev, password: "" }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-petsu-green flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <motion.img 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            src="/lovable-uploads/1a656558-105f-41b6-b91a-c324a03f1217.png"
            alt="Petsu"
            className="w-48 mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-white/80">Sign in to access the admin dashboard</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-petsu-blue">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleFormChange}
                disabled={isLoading}
                required
                className={`bg-white ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500 mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleFormChange}
                  disabled={isLoading}
                  required
                  className={`bg-white pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  minLength={6}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-500 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-petsu-blue hover:bg-petsu-blue/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In as Admin"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/auth")}
              className="text-sm text-petsu-blue hover:underline"
              disabled={isLoading}
            >
              Return to Regular Login
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuth;
