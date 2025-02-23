
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/features/admin/components/DashboardHeader";
import { PendingEventsList } from "@/features/admin/components/PendingEventsList";
import { PendingVetsList } from "@/features/admin/components/PendingVetsList";

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
        <DashboardHeader onSignOut={handleSignOut} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PendingEventsList />
          <PendingVetsList />
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
