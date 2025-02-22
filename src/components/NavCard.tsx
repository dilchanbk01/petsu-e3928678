
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface NavCardProps {
  title: string;
  imagePath: string;
  to: string;
}

const NavCard = ({ title, imagePath, to }: NavCardProps) => (
  <Link to={to}>
    <motion.div
      className="bg-white rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <ArrowRight className="w-6 h-6 text-gray-400" />
      </div>
      <div className="flex items-center justify-center">
        <img 
          src={imagePath} 
          alt={title} 
          className="w-48 h-48 object-contain"
          loading="lazy"
          width={192}
          height={192}
        />
      </div>
    </motion.div>
  </Link>
);

export default NavCard;
