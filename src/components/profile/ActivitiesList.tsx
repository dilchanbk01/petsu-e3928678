
import { Medal } from "lucide-react";

interface Activity {
  id: string;
  activity_type: 'event' | 'consultation' | 'vet_appointment';
  activity_date: string;
  status: string;
}

interface ActivitiesListProps {
  activities: Activity[];
}

export const ActivitiesList = ({ activities }: ActivitiesListProps) => {
  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-center text-petsu-blue/60 py-8">
          No activities yet. Join events or book consultations to see them here!
        </p>
      ) : (
        activities.map((activity) => (
          <div 
            key={activity.id}
            className="bg-petsu-yellow/10 p-4 rounded-xl border-2 border-petsu-blue"
          >
            <div className="flex items-center gap-2 mb-2">
              <Medal className="w-5 h-5 text-petsu-blue" />
              <span className="font-semibold text-petsu-blue">
                {activity.activity_type === 'event' ? 'Event Participation' :
                 activity.activity_type === 'consultation' ? 'Vet Consultation' :
                 'Vet Appointment'}
              </span>
            </div>
            <p className="text-petsu-blue/80">
              {new Date(activity.activity_date).toLocaleDateString()}
            </p>
            <p className="text-petsu-blue/60 text-sm mt-1">
              Status: {activity.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
};
