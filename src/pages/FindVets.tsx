
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FindVets = () => {
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
        Find Veterinarians
      </motion.h1>
      
      <motion.div 
        className="bg-petsu-yellow rounded-2xl p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-petsu-blue text-xl">Coming soon: Find trusted veterinarians near you!</p>
      </motion.div>
    </div>
  );
};

export default FindVets;
