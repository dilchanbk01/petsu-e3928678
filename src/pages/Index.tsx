import { ArrowRight, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { lazy, Suspense } from "react";

const NavCard = lazy(() => import("@/components/NavCard"));

const ProfileMenu = () => {
  const navigate = useNavigate();
  const userName = "John Doe"; // This could be fetched from your auth state

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
          <DropdownMenuItem 
            className="rounded-lg hover:bg-petsu-yellow/20 cursor-pointer py-3 px-4 text-petsu-blue font-medium"
            onClick={() => navigate('/profile')}
          >
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg hover:bg-petsu-yellow/20 cursor-pointer py-3 px-4 text-petsu-blue font-medium">
            My Tickets
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg hover:bg-petsu-yellow/20 cursor-pointer py-3 px-4 text-petsu-blue font-medium">
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
  return (
    <div className="min-h-screen p-6 md:p-8 flex flex-col items-center justify-center relative">
      <ProfileMenu />
      
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
            <div className="h-[200px]">
              <Suspense fallback={<LoadingCard />}>
                <NavCard 
                  title="Events" 
                  to="/events"
                  imagePath="/lovable-uploads/9b8425df-44cc-4a78-802b-a7fe5d270f3a.png"
                />
              </Suspense>
            </div>
            <div className="h-[200px]">
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
                to="https://supertails.com/"
                imagePath="/lovable-uploads/0f7eef24-076a-498b-8b25-6693ba92d01c.png"
                external
              />
            </Suspense>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          <Suspense fallback={<LoadingCard />}>
            <NavCard 
              title="Events" 
              to="/events"
              imagePath="/lovable-uploads/9b8425df-44cc-4a78-802b-a7fe5d270f3a.png"
            />
          </Suspense>
          <Suspense fallback={<LoadingCard />}>
            <NavCard 
              title="Find Vets" 
              to="/find-vets"
              imagePath="/lovable-uploads/a3170256-7917-4520-8e32-415c15d0ce0d.png"
            />
          </Suspense>
          <Suspense fallback={<LoadingCard />}>
            <NavCard 
              title="Pet Essentials" 
              to="https://supertails.com/"
              imagePath="/lovable-uploads/0f7eef24-076a-498b-8b25-6693ba92d01c.png"
              external
            />
          </Suspense>
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
