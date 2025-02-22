
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

const Index = () => {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
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
