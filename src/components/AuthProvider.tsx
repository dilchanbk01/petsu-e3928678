
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userType: 'user' | 'vet' | 'admin' | null;
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: true,
  signOut: async () => {},
  userType: null
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'user' | 'vet' | 'admin' | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkUserType(session?.user?.id);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      checkUserType(session?.user?.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserType = async (userId: string | undefined) => {
    if (!userId) {
      setUserType(null);
      return;
    }

    try {
      // Check if admin
      const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: userId });
      if (isAdmin) {
        setUserType('admin');
        return;
      }

      // Check if vet
      const { data: vetData } = await supabase
        .from('vet_credentials')
        .select('vet_id')
        .eq('email', session?.user?.email)
        .single();

      if (vetData) {
        setUserType('vet');
        return;
      }

      // If not admin or vet, then regular user
      setUserType('user');
    } catch (error) {
      console.error('Error checking user type:', error);
      setUserType('user'); // Default to regular user
    }
  };

  const signOut = async () => {
    try {
      // If user is a vet, set them as offline
      if (userType === 'vet') {
        const { data: vetData } = await supabase
          .from('vet_credentials')
          .select('vet_id')
          .eq('email', session?.user?.email)
          .single();

        if (vetData?.vet_id) {
          await supabase
            .from('vet_availability')
            .update({ is_online: false })
            .eq('vet_id', vetData.vet_id);
        }
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      setUserType(null);
      localStorage.removeItem('vetId'); // Clear vet session if exists
      
      // Redirect based on user type
      switch (userType) {
        case 'vet':
          navigate('/vet-auth');
          break;
        case 'admin':
          navigate('/admin-auth');
          break;
        default:
          navigate('/');
      }
      
      toast.success('Successfully signed out');
    } catch (error: any) {
      toast.error('Error signing out');
      console.error('Error:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, signOut, userType }}>
      {children}
    </AuthContext.Provider>
  );
};
