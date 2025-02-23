
import { LogOut, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  activeTab: 'consultations' | 'profile' | 'insights';
  isOnline: boolean;
  onTabChange: (tab: 'consultations' | 'profile' | 'insights') => void;
  onToggleOnline: () => void;
  onLogout: () => void;
}

const DashboardHeader = ({
  activeTab,
  isOnline,
  onTabChange,
  onToggleOnline,
  onLogout
}: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex gap-4">
        <Button
          variant="ghost"
          className={`${activeTab === 'consultations' ? 'bg-blue-100' : ''}`}
          onClick={() => onTabChange('consultations')}
        >
          Consultations
        </Button>
        <Button
          variant="ghost"
          className={`${activeTab === 'profile' ? 'bg-blue-100' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          Profile
        </Button>
        <Button
          variant="ghost"
          className={`${activeTab === 'insights' ? 'bg-blue-100' : ''}`}
          onClick={() => onTabChange('insights')}
        >
          Insights
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={onToggleOnline}
          className={`${
            isOnline ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'
          } text-white`}
        >
          {isOnline ? (
            <ToggleRight className="w-5 h-5 mr-2" />
          ) : (
            <ToggleLeft className="w-5 h-5 mr-2" />
          )}
          {isOnline ? 'Online' : 'Offline'}
        </Button>

        <Button 
          variant="outline"
          onClick={onLogout}
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
