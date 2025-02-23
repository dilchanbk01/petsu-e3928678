
import { ArrowRight, UserCircle, LogIn, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { lazy, Suspense, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const NavCard = lazy(() => import("@/components/NavCard"));

const AuthButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-6 right-6 flex gap-3">
      <Button 
        variant="outline" 
        className="bg-white/90 backdrop-blur-sm border-2 border-petsu-blue rounded-full px-6 py-2 hover:bg-petsu-yellow/20 transition-all duration-300"
        onClick={() => navigate('/auth')}
      >
        <LogIn className="w-5 h-5 mr-2 text-petsu-blue" />
        <span className="text-petsu-blue">Sign In</span>
      </Button>
      <Button 
        variant="outline" 
        className="bg-petsu-blue backdrop-blur-sm border-2 border-petsu-blue rounded-full px-6 py-2 hover:bg-petsu-blue/90 transition-all duration-300"
        onClick={() => navigate('/auth', { state: { isSignUp: true } })}
      >
        <UserPlus className="w-5 h-5 mr-2 text-white" />
        <span className="text-white">Sign Up</span>
      </Button>
    </div>
  );
};

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setUserName(profile?.full_name || session.user.email || "User");
    };

    fetchProfile();
  }, [session]);

  return (
    <div className="absolute top-6 right-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-white/90 backdrop-blur-sm border-2 border-petsu-blue rounded-full px-6 py-2 hover:bg-petsu-yellow/20 transition-all duration-300"
          >
            <UserCircle className="w-6 h-6 text-petsu-blue" />
            <span className="ml-2 font-semibold text-petsu-blue">{userName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 p-2 bg-white/95 backdrop-blur-sm border-2 border-petsu-blue rounded-xl shadow-lg"
        >
          <Link to="/profile">
            <DropdownMenuItem 
              className="rounded-lg hover:bg-petsu-yellow/20 cursor-pointer py-3 px-4 text-petsu-blue font-medium"
            >
              Profile Settings
            </DropdownMenuItem>
          </Link>
          <Link to="/events">
            <DropdownMenuItem className="rounded-lg hover:bg-petsu-yellow/20 cursor-pointer py-3 px-4 text-petsu-blue font-medium">
              My Tickets
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem 
            className="rounded-lg hover:bg-petsu-yellow/20 cursor-pointer py-3 px-4 text-petsu-blue font-medium"
            onClick={signOut}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const LoadingCard = () => (
  <div className="nav-card animate-pulse">
    <div className="h-8 bg-petsu-blue/10 rounded mb-4"></div>
    <div className="h-32 bg-petsu-blue/10 rounded"></div>
  </div>
);

const Index = () => {
  const { session } = useAuth();

  return (
    <div className="min-h-screen p-6 md:p-8 flex flex-col items-center justify-center relative">
      {session ? <ProfileMenu /> : <AuthButtons />}
      
      <motion.div
        className="w-64 md:w-80 mb-12"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src="/lovable-uploads/1a656558-105f-41b6-b91a-c324a03f1217.png"
          alt="Petsu"
          className="w-full h-auto"
        />
      </motion.div>

      <div className="w-full max-w-4xl">
        {/* Mobile layout */}
        <div className="md:hidden grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square">
              <Suspense fallback={<LoadingCard />}>
                <NavCard 
                  title="Events" 
                  to="/events"
                  imagePath="/lovable-uploads/a6a449a5-6229-468c-b139-1e521c756165.png"
                />
              </Suspense>
            </div>
            <div className="aspect-square">
              <Suspense fallback={<LoadingCard />}>
                <NavCard 
                  title="Find Vets" 
                  to="/find-vets"
                  imagePath="/lovable-uploads/a3170256-7917-4520-8e32-415c15d0ce0d.png"
                />
              </Suspense>
            </div>
          </div>
          <div className="h-[160px]">
            <Suspense fallback={<LoadingCard />}>
              <NavCard 
                title="Pet Essentials" 
                to="/pet-essentials"
                imagePath="/lovable-uploads/bd02a697-b0c3-489a-8f61-119468f1a724.png"
              />
            </Suspense>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          <div className="aspect-square">
            <Suspense fallback={<LoadingCard />}>
              <NavCard 
                title="Events" 
                to="/events"
                imagePath="/lovable-uploads/a6a449a5-6229-468c-b139-1e521c756165.png"
              />
            </Suspense>
          </div>
          <div className="aspect-square">
            <Suspense fallback={<LoadingCard />}>
              <NavCard 
                title="Find Vets" 
                to="/find-vets"
                imagePath="/lovable-uploads/a3170256-7917-4520-8e32-415c15d0ce0d.png"
              />
            </Suspense>
          </div>
          <div className="aspect-square">
            <Suspense fallback={<LoadingCard />}>
              <NavCard 
                title="Pet Essentials" 
                to="/pet-essentials"
                imagePath="/lovable-uploads/bd02a697-b0c3-489a-8f61-119468f1a724.png"
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Vet Onboarding CTA Section */}
      <motion.div 
        className="w-full max-w-4xl mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-gradient-to-r from-petsu-blue to-petsu-blue/80 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">Are you a veterinarian?</h2>
              <p className="text-white/90 text-sm mb-3">Join our network of professional vets and connect with pet owners.</p>
              <Link to="/vet-onboarding">
                <Button className="bg-white text-petsu-blue hover:bg-petsu-yellow text-sm py-1">
                  Join as a Vet Partner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
