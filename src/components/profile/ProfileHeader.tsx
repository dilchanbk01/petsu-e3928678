
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface ProfileHeaderProps {
  profile: {
    full_name: string;
    created_at: string;
    avatar_url: string | null;
  } | null;
  onSignOut: () => Promise<void>;
}

export const ProfileHeader = ({ profile, onSignOut }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-petsu-blue/20">
      <div className="bg-petsu-blue/10 p-4 rounded-full">
        {profile?.avatar_url ? (
          <img 
            src={profile.avatar_url} 
            alt={profile.full_name} 
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <User className="w-16 h-16 text-petsu-blue" />
        )}
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-petsu-blue">{profile?.full_name}</h1>
        <p className="text-petsu-blue/60">
          Member since {new Date(profile?.created_at || '').toLocaleDateString()}
        </p>
      </div>
      <Button
        variant="outline"
        className="border-2 border-red-500 text-red-500 hover:bg-red-50"
        onClick={onSignOut}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};
