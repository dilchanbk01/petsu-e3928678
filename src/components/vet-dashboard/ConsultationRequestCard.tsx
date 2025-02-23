
import { Button } from "@/components/ui/button";
import { ConsultationRequest } from "@/types/vet";
import { Check, X } from "lucide-react";

interface ConsultationRequestCardProps {
  request: ConsultationRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

const ConsultationRequestCard = ({ request, onAccept, onDecline }: ConsultationRequestCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between mb-4">
        <span className="font-medium">Patient ID: {request.user_id.slice(0, 8)}</span>
        <span className="text-petsu-blue font-bold">${request.amount}</span>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          onClick={() => onAccept(request.id)}
          className="flex-1 bg-green-500 hover:bg-green-600"
        >
          <Check className="w-4 h-4 mr-2" />
          Accept
        </Button>
        <Button
          onClick={() => onDecline(request.id)}
          variant="outline"
          className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
        >
          <X className="w-4 h-4 mr-2" />
          Decline
        </Button>
      </div>
    </div>
  );
};

export default ConsultationRequestCard;
