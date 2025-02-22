
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

const NavCard = ({ title, imagePath, to }: { title: string; imagePath: string; to: string }) => (
  <Link to={to}>
    <motion.div
      className="nav-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="nav-card-title">
        {title} <ArrowRight className="w-6 h-6" />
      </div>
      <img src={imagePath} alt={title} className="nav-card-image" />
    </motion.div>
  </Link>
);

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

const Index = () => {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center relative">
      <ProfileMenu />
      
      <motion.h1
        className="logo-text mb-16 animate-bounce-subtle"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Petsu
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        <NavCard 
          title="Events" 
          to="/events"
          imagePath={"/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png"} 
        />
        <NavCard 
          title="Find Vets" 
          to="/find-vets"
          imagePath={"/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png"} 
        />
        <NavCard 
          title="Pet Essentials" 
          to="/pet-essentials"
          imagePath={"/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png"} 
        />
      </div>
    </div>
  );
};

export default Index;
