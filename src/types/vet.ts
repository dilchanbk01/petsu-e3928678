
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

export interface Vet {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  languages: string[];
  consultation_fee: number;
  rating: number;
  image_url: string | null;
  approval_status: 'pending' | 'approved' | 'rejected';
}

export interface Appointment {
  id: string;
  pet_name: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  user_id: string;
  vet_id: string;
  session_type: 'video' | 'chat';
  amount: number;
}
