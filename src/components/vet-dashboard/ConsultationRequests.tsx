
import { ConsultationRequest } from "@/types/vet";
import { Button } from "@/components/ui/button";

interface ConsultationRequestsProps {
  requests: ConsultationRequest[];
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

const ConsultationRequests = ({ requests, onAccept, onDecline }: ConsultationRequestsProps) => {
  if (requests.length === 0) return null;

  return (
    <div className="bg-blue-600 rounded-xl p-6 text-white mb-6">
      <h2 className="text-xl font-semibold mb-4">Consultation Requests</h2>
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex justify-between items-center">
            <span className="text-lg">User {request.user_id.slice(0, 8)}</span>
            <div className="flex gap-3">
              <Button
                onClick={() => onAccept(request.id)}
                className="bg-green-500 hover:bg-green-600"
              >
                Accept
              </Button>
              <Button
                onClick={() => onDecline(request.id)}
                variant="outline"
                className="border-red-400 text-red-400 hover:bg-red-400/10"
              >
                Decline
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultationRequests;
