
interface SearchHeaderProps {
  userLocation?: { lat: number; lng: number; } | null;
}

const SearchHeader = ({ userLocation }: SearchHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Available Veterinarians</h2>
      {userLocation && (
        <span className="text-sm text-gray-600">
          Using your location for nearby vets
        </span>
      )}
    </div>
  );
};

export default SearchHeader;
