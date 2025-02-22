
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "admin@petsu.com",
    password: "AdminPetsu2024!",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      // If sign in fails because user doesn't exist, create the user
      if (signInError && signInError.message.includes("Invalid login credentials")) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) throw signUpError;

        // After successful signup, try to create admin user
        if (signUpData.user) {
          const { error: adminError } = await supabase
            .from('admin_users')
            .insert([{ id: signUpData.user.id }]);

          if (adminError) throw adminError;
          
          // Sign in after successful signup
          const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

          if (newSignInError) throw newSignInError;
          
          toast.success("Admin account created and logged in successfully!");
          navigate('/admin');
          return;
        }
      }

      if (signInError) throw signInError;

      // For existing users, verify admin status
      if (signInData.user) {
        const { data: adminData, error: adminCheckError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', signInData.user.id)
          .maybeSingle();

        if (adminCheckError) throw adminCheckError;

        if (!adminData) {
          // If not an admin, try to create admin entry
          const { error: adminCreateError } = await supabase
            .from('admin_users')
            .insert([{ id: signInData.user.id }]);

          if (adminCreateError) throw adminCreateError;
        }

        toast.success("Welcome back, admin!");
        navigate('/admin');
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-petsu-green flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <img 
            src="/lovable-uploads/1a656558-105f-41b6-b91a-c324a03f1217.png"
            alt="Petsu"
            className="w-48 mx-auto mb-6"
          />
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-petsu-blue">
          <h1 className="text-2xl font-bold text-petsu-blue mb-6 text-center">
            Admin Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  readOnly
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-petsu-blue hover:bg-petsu-blue/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              className="text-sm text-petsu-blue hover:underline"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuth;
