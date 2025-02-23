
export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: number;
  imageUrl: string;
  available_tickets: number;
  type?: string;
  latitude?: number;
  longitude?: number;
}
