
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

// Lazy load the NavCard component
const NavCard = lazy(() => import("@/components/NavCard"));

// Separate ProfileMenu into its own component
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
      
      <motion.h1
        className="logo-text mb-12"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Petsu
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <Suspense fallback={<LoadingCard />}>
          <NavCard 
            title="Events" 
            to="/events"
            imagePath={"/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png"} 
          />
        </Suspense>
        <Suspense fallback={<LoadingCard />}>
          <NavCard 
            title="Find Vets" 
            to="/find-vets"
            imagePath={"/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png"} 
          />
        </Suspense>
        <Suspense fallback={<LoadingCard />}>
          <NavCard 
            title="Pet Essentials" 
            to="/pet-essentials"
            imagePath={"/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png"} 
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Index;
