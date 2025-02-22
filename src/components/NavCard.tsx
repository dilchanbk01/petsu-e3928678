
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface NavCardProps {
  title: string;
  imagePath: string;
  to: string;
  external?: boolean;
}

const NavCard = ({ title, imagePath, to, external }: NavCardProps) => {
  const CardContent = (
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
      <div className="flex items-center justify-center p-1">
        <img 
          src={imagePath} 
          alt={title} 
          className="w-48 h-48 md:w-36 md:h-36 object-contain"
          loading="lazy"
          width={192}
          height={192}
        />
      </div>
    </motion.div>
  );

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="h-full">
        {CardContent}
      </a>
    );
  }

  return (
    <Link to={to} className="h-full">
      {CardContent}
    </Link>
  );
};

export default NavCard;
