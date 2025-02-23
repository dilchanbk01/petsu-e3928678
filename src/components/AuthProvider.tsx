
import { createContext, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "@/features/auth/types/auth";
import { useUserTypeCheck } from "@/features/auth/hooks/useUserTypeCheck";
import { useAuthManagement } from "@/features/auth/hooks/useAuthManagement";
import { handleAuthRedirection } from "@/features/auth/utils/routeProtection";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { userType, checkUserType } = useUserTypeCheck();
  const { session, setSession, loading, setLoading, signOut, refreshSession } = useAuthManagement(userType);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      setSession(session);
      checkUserType(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      await checkUserType(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Protected route redirections
  useEffect(() => {
    handleAuthRedirection(
      loading,
      session,
      userType,
      location.pathname,
      location.navigate
    );
  }, [session, loading, userType, location.pathname]);

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
