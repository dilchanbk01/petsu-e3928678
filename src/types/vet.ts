
export interface Vet {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  location: string;
  image_url: string;
  consultation_fee: number;
  languages: string[];
  experience: string;
  created_at: string;
  updated_at: string;
}

export interface VetAvailability {
  id: string;
  vet_id: string;
  is_online: boolean;
  last_seen_at: string;
  available_slots: string[];
  created_at: string;
  updated_at: string;
}

export interface VetWithAvailability extends Vet {
  availability: VetAvailability;
}
