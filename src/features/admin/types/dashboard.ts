
export interface Event {
  id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  approval_status: 'pending' | 'approved' | 'declined';
}

export interface AdminRole {
  role: string;
}
