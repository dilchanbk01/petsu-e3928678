
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type UserType = 'user' | 'vet' | 'admin' | null;

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userType: UserType;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<UserType>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkUserType = async (userId: string | undefined) => {
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

  const refreshSession = async () => {
    try {
      const { data: { session: newSession }, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(newSession);
      if (newSession?.user) {
        await checkUserType(newSession.user.id);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      toast.error('Error refreshing session');
    }
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        toast.error('Error retrieving session');
      }
      setSession(session);
      if (session?.user) {
        checkUserType(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await checkUserType(session.user.id);
      } else {
        setUserType(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      setUserType(null);
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

  // Protected route redirections
  useEffect(() => {
    const handleAuthRedirection = async () => {
      if (loading) return;

      const publicRoutes = ['/', '/auth', '/vet-auth', '/admin-auth', '/vet-onboarding'];
      const currentPath = location.pathname;

      // Allow access to public routes
      if (publicRoutes.includes(currentPath)) return;

      // Redirect to appropriate auth page if not authenticated
      if (!session) {
        if (currentPath.startsWith('/admin')) {
          navigate('/admin-auth');
        } else if (currentPath.startsWith('/vet')) {
          navigate('/vet-auth');
        } else {
          navigate('/auth');
        }
        return;
      }

      // Role-based access control
      if (currentPath.startsWith('/admin') && userType !== 'admin') {
        navigate('/');
        toast.error('Access denied: Admin privileges required');
      } else if (currentPath.startsWith('/vet-dashboard') && userType !== 'vet') {
        navigate('/');
        toast.error('Access denied: Veterinarian privileges required');
      }
    };

    handleAuthRedirection();
  }, [session, loading, userType, location.pathname, navigate]);

  const value = {
    session,
    loading,
    signOut,
    userType,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
