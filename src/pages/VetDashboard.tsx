import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar,
  Users,
  MessageSquare,
  Video,
  Clock,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  type: "scheduled" | "immediate";
  status: "pending" | "completed" | "cancelled";
}

const mockAppointments: Appointment[] = [
  {
    id: 1,
    patientName: "John's Dog Max",
    time: "10:00 AM",
    type: "scheduled",
    status: "pending"
  },
  {
    id: 2,
    patientName: "Sarah's Cat Luna",
    time: "11:30 AM",
    type: "immediate",
    status: "pending"
  }
];

const VetDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);

  const handleToggleStatus = () => {
    setIsOnline(!isOnline);
    toast.success(`Status updated to ${!isOnline ? 'Online' : 'Offline'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <motion.div 
          className="w-64 bg-white h-screen shadow-lg p-6 flex flex-col"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"
              alt="Vet profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">Dr. Michael Chen</h3>
              <p className="text-sm text-gray-500">Veterinarian</p>
            </div>
          </div>

          <nav className="flex-1">
            <Button 
              variant="ghost"
              className="w-full justify-start mb-2"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </Button>
            <Button 
              variant="ghost"
              className="w-full justify-start mb-2"
            >
              <Users className="mr-2 h-4 w-4" />
              Patients
            </Button>
            <Button 
              variant="ghost"
              className="w-full justify-start mb-2"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            <Button 
              variant="ghost"
              className="w-full justify-start mb-2"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>

          <Button 
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </motion.div>

        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <Button
                onClick={handleToggleStatus}
                className={`${
                  isOnline 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-500 hover:bg-gray-600'
                } text-white`}
              >
                {isOnline ? 'Online' : 'Offline'}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-gray-500 mb-2">Today's Appointments</h3>
                <p className="text-3xl font-bold">8</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-gray-500 mb-2">Pending Requests</h3>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-gray-500 mb-2">Total Patients</h3>
                <p className="text-3xl font-bold">127</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
              <div className="space-y-4">
                {mockAppointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        appointment.type === 'immediate' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {appointment.type === 'immediate' ? (
                          <Clock className="w-5 h-5 text-red-600" />
                        ) : (
                          <Calendar className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{appointment.patientName}</h4>
                        <p className="text-sm text-gray-500">{appointment.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Video className="w-4 h-4 mr-2" />
                        Start Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
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

export default VetDashboard;
