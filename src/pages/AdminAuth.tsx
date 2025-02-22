
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const AdminAuth = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // If user is already authenticated as admin, redirect to admin dashboard
  if (isAdmin) {
    navigate("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) throw error;

      // Check if the user is an admin after successful login
      const { data: isAdminUser } = await supabase.rpc('is_admin', { 
        user_id: (await supabase.auth.getUser()).data.user?.id 
      });

      if (!isAdminUser) {
        // If not an admin, sign them out and show error
        await supabase.auth.signOut();
        throw new Error("Access denied. This portal is for administrators only.");
      }

      toast.success("Welcome back, admin!");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during login");
      console.error("Admin login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-petsu-blue/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <img 
            src="/lovable-uploads/1a656558-105f-41b6-b91a-c324a03f1217.png"
            alt="Petsu"
            className="w-32 mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-petsu-blue">Admin Portal</h1>
          <p className="text-gray-600 mt-2">Please sign in to access the admin dashboard</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-petsu-blue">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
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
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="text-sm text-petsu-blue hover:underline"
            >
              Return to User Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuth;
