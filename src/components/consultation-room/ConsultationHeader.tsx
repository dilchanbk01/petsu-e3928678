
import { Button } from "@/components/ui/button";
import { Video, X } from "lucide-react";

interface ConsultationHeaderProps {
  onVideoToggle: () => void;
  onClose: () => void;
}

const ConsultationHeader = ({ onVideoToggle, onClose }: ConsultationHeaderProps) => {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-petsu-blue text-white rounded-t-lg">
      <h2 className="text-xl font-semibold">Consultation Session</h2>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-petsu-blue/90"
          onClick={onVideoToggle}
        >
          <Video className="h-5 w-5 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-petsu-blue/90"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default ConsultationHeader;
