
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import NavCard from "@/components/NavCard";

const PetEssentials = () => {
  return (
    <div className="min-h-screen p-8">
      <Link to="/">
        <motion.div
          className="flex items-center text-petsu-yellow mb-8 hover:text-petsu-blue transition-colors"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span className="text-xl font-semibold">Back to Home</span>
        </motion.div>
      </Link>
      
      <motion.h1 
        className="text-4xl font-bold text-petsu-yellow mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Pet Essentials
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <NavCard
          title="Shop at SuperTails"
          imagePath="/lovable-uploads/a6a449a5-6229-468c-b139-1e521c756165.png"
          to="https://supertails.com/"
          external={true}
        />
      </motion.div>
    </div>
  );
};

export default PetEssentials;
