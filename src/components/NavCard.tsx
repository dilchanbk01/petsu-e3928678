
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
      className="nav-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="nav-card-title text-xl">
        {title} <ArrowRight className="w-4 h-4" />
      </div>
      <img 
        src={imagePath} 
        alt={title} 
        className="nav-card-image w-24 h-24"
        loading="lazy"
        width={96}
        height={96}
      />
    </motion.div>
  </Link>
);

export default NavCard;
