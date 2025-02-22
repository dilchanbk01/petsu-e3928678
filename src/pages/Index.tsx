
import { motion } from "framer-motion";
import { User, Ticket, Mail, Phone, Home, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const Index = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 1234567890',
      address: 'Chennai, Tamil Nadu'
    };
  });

  const [editForm, setEditForm] = useState(profile);

  const handleSave = () => {
    setProfile(editForm);
    localStorage.setItem('userProfile', JSON.stringify(editForm));
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="min-h-screen p-8">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-petsu-blue">My Profile</h1>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="text-petsu-blue hover:text-petsu-yellow hover:bg-petsu-blue"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                />
              </div>
              <Button
                className="w-full bg-petsu-blue text-white hover:bg-petsu-blue/90"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-petsu-yellow rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-petsu-blue" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-petsu-blue">{profile.name}</h2>
                  <p className="text-gray-600">Member since 2024</p>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-petsu-blue" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-petsu-blue" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Home className="w-5 h-5 text-petsu-blue" />
                  <span>{profile.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6 mt-6">
                <Link to="/my-tickets">
                  <Button className="w-full bg-petsu-yellow text-petsu-blue hover:bg-petsu-yellow/90">
                    <Ticket className="w-4 h-4 mr-2" />
                    My Tickets
                  </Button>
                </Link>
                <Link to="/events">
                  <Button className="w-full bg-petsu-blue text-white hover:bg-petsu-blue/90">
                    Browse Events
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
