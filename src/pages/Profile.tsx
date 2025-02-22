
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Profile = () => {
  // This would typically come from your auth state
  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    joinedDate: "January 2024",
    pets: ["Max (Dog)", "Luna (Cat)"]
  };

  return (
    <div className="min-h-screen bg-petsu-green p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button 
              variant="outline" 
              className="bg-white/90 hover:bg-petsu-yellow/20 border-2 border-petsu-blue text-petsu-blue"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <img 
            src="/lovable-uploads/0a2713cc-b038-4b98-9603-83f497104e2e.png" 
            alt="Petsu Logo" 
            className="h-12 w-auto"
          />
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-petsu-blue shadow-lg">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-petsu-blue/20">
            <div className="bg-petsu-blue/10 p-4 rounded-full">
              <User className="w-16 h-16 text-petsu-blue" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-petsu-blue">{userProfile.name}</h1>
              <p className="text-petsu-blue/60">Member since {userProfile.joinedDate}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-petsu-blue" />
              <span className="text-petsu-blue">{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-petsu-blue" />
              <span className="text-petsu-blue">{userProfile.phone}</span>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-petsu-blue mb-4">My Pets</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userProfile.pets.map((pet, index) => (
                  <div 
                    key={index}
                    className="bg-petsu-yellow/10 p-4 rounded-xl border-2 border-petsu-blue text-petsu-blue"
                  >
                    {pet}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
