
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserType } from "../types/auth";

export const useAuthManagement = (userType: UserType) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      setLoading(true);
      
      // If user is a vet, set them as offline
      if (userType === 'vet' && session?.user?.email) {
        const { data: vetData, error: vetError } = await supabase
          .from('vet_credentials')
          .select('vet_id')
          .eq('email', session.user.email)
          .single();

        if (!vetError && vetData?.vet_id) {
          await supabase
            .from('vet_availability')
            .update({ is_online: false })
            .eq('vet_id', vetData.vet_id);
        }
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      localStorage.removeItem('vetId');
      
      // Redirect based on user type
      switch (userType) {
        case 'vet':
          navigate('/vet-auth');
          break;
        case 'admin':
          navigate('/admin-auth');
          break;
        default:
          navigate('/auth');
      }
      
      toast.success('Successfully signed out');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Error signing out');
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session: newSession }, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(newSession);
    } catch (error) {
      console.error('Error refreshing session:', error);
      toast.error('Error refreshing session');
    }
  };

  return {
    session,
    setSession,
    loading,
    setLoading,
    signOut,
    refreshSession
  };
};
