
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: adminRole } = useQuery({
    queryKey: ['adminRole'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching admin role:', error);
        toast.error('Error fetching admin role');
        return null;
      }

      return data;
    }
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin-auth");
  };

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-petsu-blue">Admin Dashboard</h1>
            {adminRole && (
              <p className="text-gray-600 mt-1 capitalize">
                Role: {adminRole.role}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            className="border-2 border-petsu-blue text-petsu-blue hover:bg-petsu-blue/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border-2 border-petsu-blue">
            <h2 className="text-xl font-semibold text-petsu-blue mb-4">
              Welcome to Admin Dashboard
            </h2>
            <p className="text-gray-600">
              This is where you'll manage your application's settings and content.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
