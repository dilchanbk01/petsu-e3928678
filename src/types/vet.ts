
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

export interface Appointment {
  id: string;
  vet_id: string;
  user_id: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  amount: number;
  session_type: 'video' | 'chat';
  created_at: string;
  updated_at: string;
}
