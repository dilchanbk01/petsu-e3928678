
import { motion } from "framer-motion";
import { Star, MapPin, Circle } from "lucide-react";
import { VetWithAvailability } from "@/types/vet";

interface VetCardProps {
  vet: VetWithAvailability;
}

const VetCard = ({ vet }: VetCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={vet.image_url || '/lovable-uploads/c8691e4f-1095-4f6e-ae4b-a47d88f7384a.png'}
              alt={vet.name}
              className="w-16 h-16 object-cover rounded-full border-2 border-white shadow"
            />
            <div className={`absolute bottom-0 right-0 p-1 rounded-full ${
              vet.availability.is_online ? 'bg-green-500' : 'bg-gray-400'
            }`}>
              <Circle className="w-2 h-2 fill-white text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{vet.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{vet.rating}</span>
              </div>
            </div>
            
            <div className="mt-1 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{vet.location}</span>
              </div>
              <div className="mt-1">
                {vet.specialty.split(',')[0]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VetCard;
