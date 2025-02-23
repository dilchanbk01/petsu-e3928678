
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "@/utils/imageCompression";

interface ImageUploadProps {
  imageUrl: string;
  onImageUpload: (url: string) => void;
}

export const ImageUpload = ({ imageUrl, onImageUpload }: ImageUploadProps) => {
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const compressedFile = await compressImage(file);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('vet-profiles')
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vet-profiles')
        .getPublicUrl(fileName);

      onImageUpload(publicUrl);
      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="space-y-2">
      <Label>Profile Image</Label>
      <div className="flex items-center gap-4">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Profile preview"
            className="w-20 h-20 rounded-full object-cover"
          />
        )}
        <Button
          type="button"
          variant="outline"
          className="w-full h-20 flex flex-col items-center justify-center border-dashed"
          onClick={() => document.getElementById('imageUpload')?.click()}
        >
          <Upload className="w-6 h-6 mb-2" />
          Upload Photo
        </Button>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};
