
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConsultationButtonsProps {
  showConsultation: boolean;
  onStartConsultation: () => void;
  onEndConsultation: () => void;
}

const ConsultationButtons = ({
  showConsultation,
  onStartConsultation,
  onEndConsultation
}: ConsultationButtonsProps) => {
  return (
    <div className="flex justify-center gap-4">
      <Button 
        size="lg"
        className="bg-petsu-blue hover:bg-petsu-blue/90 text-white"
        onClick={onStartConsultation}
      >
        <MessageSquare className="w-5 h-5 mr-2" />
        Start Instant Consultation
      </Button>

      {showConsultation && (
        <Button 
          size="lg"
          variant="destructive"
          onClick={onEndConsultation}
        >
          End Consultation
        </Button>
      )}
    </div>
  );
};

export default ConsultationButtons;
