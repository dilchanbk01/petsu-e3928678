
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminRole } from "../types/dashboard";

interface DashboardHeaderProps {
  onSignOut: () => Promise<void>;
}

export const DashboardHeader = ({ onSignOut }: DashboardHeaderProps) => {
  const { data: adminRole } = useQuery<AdminRole>({
    queryKey: ['adminRole'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .rpc('get_admin_role', { user_id: user.id });

      if (error) {
        console.error('Error fetching admin role:', error);
        return null;
      }

      return { role: data };
    }
  });

  return (
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
        onClick={onSignOut}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};
