
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (error) {
        console.error('Auth error:', error, errorDescription);
        toast.error(errorDescription || "Authentication failed");
        return;
      }

      // Only try to get session if we have auth parameters
      if (searchParams.has('access_token') || searchParams.has('refresh_token')) {
        const { error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast.error("Failed to establish session");
        }
      }
    };

    // Handle OAuth redirect
    handleAuthRedirect();

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, searchParams]);

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
          scopes: 'email profile',
          queryParams: {
            prompt: 'select_account'
          }
        }
      });
      
      if (error) throw error;
      console.log('Auth initiated:', data);
      
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast.error(error.message || "Error connecting to Google");
    }
  };

  return (
    <div className="min-h-screen bg-petsu-green p-8 flex flex-col items-center justify-center">
      <div className="w-64 md:w-80 mb-12">
        <img 
          src="/lovable-uploads/1a656558-105f-41b6-b91a-c324a03f1217.png"
          alt="Petsu"
          className="w-full h-auto"
        />
      </div>
      
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-petsu-blue shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-petsu-blue text-center mb-8">Welcome to Petsu</h1>
        
        <Button 
          onClick={handleGoogleLogin}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 flex items-center justify-center gap-2 h-12"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-5 h-5"
          />
          Continue with Google
        </Button>
      </div>
    </div>
  );
};

export default Auth;
