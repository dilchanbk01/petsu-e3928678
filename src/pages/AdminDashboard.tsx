
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold text-petsu-blue">Admin Dashboard</h1>
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
          {/* Add your admin dashboard content here */}
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
