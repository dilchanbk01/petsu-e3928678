
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";

const SearchHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <Link to="/">
        <motion.div
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border-2 border-petsu-blue hover:bg-petsu-yellow/20 transition-all duration-300"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5 text-petsu-blue" />
        </motion.div>
      </Link>
      <div className="relative w-48">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-petsu-blue/60 w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-full border-2 border-petsu-blue bg-white text-petsu-blue placeholder-petsu-blue/60 focus:outline-none focus:ring-2 focus:ring-petsu-blue"
        />
      </div>
    </div>
  );
};

export default SearchHeader;
