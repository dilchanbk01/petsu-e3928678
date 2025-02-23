
export interface VetWithAvailability {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  languages: string[];
  consultation_fee: number;
  rating: number;
  image_url: string | null;
  availability: {
    is_online: boolean;
    available_slots: string[];
  };
}
