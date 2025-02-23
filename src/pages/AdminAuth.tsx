
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AdminLoginForm } from "@/features/admin/components/AdminLoginForm";
import { validateAdminForm, type FormData } from "@/features/admin/utils/form-validation";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleSubmit = async (formData: FormData) => {
    const validationErrors = validateAdminForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the form errors");
      return;
    }

    setIsLoading(true);

    try {
      // First sign in with Supabase Auth
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        throw signInError;
      }

      // Then check if the user has admin role
      const { data: isAdmin, error: adminCheckError } = await supabase
        .rpc('is_admin', {
          admin_email: formData.email
        });

      if (adminCheckError) {
        // If there's an error checking admin status, sign out the user
        await supabase.auth.signOut();
        throw new Error(adminCheckError.message);
      }

      if (!isAdmin) {
        // If not an admin, sign out the user
        await supabase.auth.signOut();
        throw new Error("This account does not have admin privileges");
      }

      toast.success("Welcome back, admin!");
      navigate("/admin");
    } catch (error: any) {
      console.error("Admin auth error:", error);
      toast.error(error.message || "Failed to sign in");
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
          <AdminLoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            errors={errors}
            setErrors={setErrors}
          />

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
