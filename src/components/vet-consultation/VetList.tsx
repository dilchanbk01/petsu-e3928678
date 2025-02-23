
import VetCard from "./VetCard";
import { VetWithAvailability } from "@/types/vet";

interface VetListProps {
  vets: VetWithAvailability[];
  isLoading: boolean;
}

const VetList = ({ vets, isLoading }: VetListProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading vets...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {vets.map((vet) => (
        <VetCard key={vet.id} vet={vet} />
      ))}
    </div>
  );
};

export default VetList;
