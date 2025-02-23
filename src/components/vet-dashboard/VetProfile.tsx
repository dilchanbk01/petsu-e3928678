
import { Award, Clock, Globe, MapPin } from "lucide-react";
import { Vet } from "@/types/vet";

interface VetProfileProps {
  vetDetails: Vet;
}

const VetProfile = ({ vetDetails }: VetProfileProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-start gap-6">
        <img
          src={vetDetails.image_url || '/placeholder.svg'}
          alt={vetDetails.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">{vetDetails.name}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-petsu-blue" />
              <span>{vetDetails.specialty}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-petsu-blue" />
              <span>{vetDetails.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-petsu-blue" />
              <span>{vetDetails.experience}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-petsu-blue" />
              <span>{vetDetails.languages.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetProfile;
