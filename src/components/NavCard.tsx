
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
      className="nav-card h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="nav-card-title text-lg font-semibold">
        {title} <ArrowRight className="w-4 h-4" />
      </div>
      <div className="flex items-center justify-center p-2">
        <img 
          src={imagePath} 
          alt={title} 
          className="w-40 h-40 md:w-32 md:h-32 object-contain"
          loading="lazy"
          width={160}
          height={160}
        />
      </div>
    </motion.div>
  </Link>
);

export default NavCard;
