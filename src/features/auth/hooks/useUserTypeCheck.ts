
import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserType } from "../types/auth";

export const useUserTypeCheck = () => {
  const [userType, setUserType] = useState<UserType>(null);

  const checkUserType = async (session: Session | null) => {
    const userId = session?.user?.id;
    
    if (!userId) {
      setUserType(null);
      return;
    }

    try {
      // Check if admin
      const { data: isAdmin, error: adminError } = await supabase
        .rpc('is_admin', { user_id: userId });

      if (adminError) {
        console.error('Error checking admin status:', adminError);
        return;
      }

      if (isAdmin) {
        setUserType('admin');
        return;
      }

      // Check if vet
      const { data: vetData, error: vetError } = await supabase
        .from('vet_credentials')
        .select('vet_id')
        .eq('email', session?.user?.email)
        .single();

      if (vetError && vetError.code !== 'PGRST116') { // Not found error
        console.error('Error checking vet status:', vetError);
        return;
      }

      if (vetData) {
        setUserType('vet');
        return;
      }

      // If not admin or vet, then regular user
      setUserType('user');
    } catch (error) {
      console.error('Error checking user type:', error);
      toast.error('Error determining user role');
      setUserType('user'); // Default to regular user
    }
  };

  return {
    userType,
    checkUserType
  };
};
