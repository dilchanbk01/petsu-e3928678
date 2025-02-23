
import { useRef } from "react";
import { Image } from "lucide-react";

interface EventBannerProps {
  previewImage: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EventBanner = ({ previewImage, onImageUpload }: EventBannerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      className="bg-petsu-yellow rounded-xl p-8 text-center cursor-pointer hover:bg-petsu-yellow/90 transition-colors relative"
      onClick={() => fileInputRef.current?.click()}
    >
      {previewImage ? (
        <div className="relative">
          <img 
            src={previewImage} 
            alt="Event preview" 
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
            <p className="text-white">Click to change image</p>
          </div>
        </div>
      ) : (
        <>
          <Image className="w-12 h-12 mx-auto mb-4 text-petsu-blue" />
          <p className="text-petsu-blue font-semibold">Click to upload event banner</p>
          <p className="text-petsu-blue/60 text-sm">Recommended size: 1200x600px</p>
        </>
      )}
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept="image/*"
        onChange={onImageUpload}
      />
    </div>
  );
};
