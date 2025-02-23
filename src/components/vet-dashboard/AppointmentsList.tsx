
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types/vet";
import { AppointmentCard } from "./AppointmentCard";

interface AppointmentsListProps {
  appointments: Appointment[];
  isLoading: boolean;
  filter: 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  onFilterChange: (filter: 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled') => void;
}

const AppointmentsList = ({ appointments, isLoading, filter, onFilterChange }: AppointmentsListProps) => {
  const filteredAppointments = appointments.filter(appointment => 
    filter === 'all' ? true : appointment.status === filter
  );

  return (
    <>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => onFilterChange(status)}
            className={`capitalize ${
              filter === status 
                ? 'bg-petsu-blue hover:bg-petsu-blue/90' 
                : 'hover:bg-gray-50'
            }`}
          >
            {status}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading appointments...</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No {filter === 'all' ? '' : filter} appointments found
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </>
  );
};

export default AppointmentsList;
