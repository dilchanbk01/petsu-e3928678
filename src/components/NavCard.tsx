
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface NavCardProps {
  title: string;
  imagePath: string;
  to: string;
}

const NavCard = ({ title, imagePath, to }: NavCardProps) => (
  <Link to={to} className="h-full">
    <motion.div
      className="nav-card h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="nav-card-title text-lg font-semibold">
        {title} <ArrowRight className="w-4 h-4" />
      </div>
      <div className="flex items-center justify-center">
        <img 
          src={imagePath} 
          alt={title} 
          className="w-48 h-48 md:w-32 md:h-32 object-contain"
          loading="lazy"
          width={192}
          height={192}
        />
      </div>
    </motion.div>
  </Link>
);

export default NavCard;
