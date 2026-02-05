export type EventType = 'festival' | 'trip' | 'market';

export interface EventItem {
  id: number;
  title: string;
  type: EventType;
  status: 'active' | 'past';
  date: string;
  price: number;
  description: string;
  location: string;
  banner: string;
  features: string[];
  refundPolicy: string;
  seatsLeft?: number;
  gallery: string[];
}

export interface Council {
  id: number;
  period: string;
  members: string[];
  active: boolean;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  gender: 'male' | 'female' | 'any';
  price: number;
  status: 'available' | 'blocked' | 'reserved';
}

export interface UserProfile {
  fullName: string;
  phone: string;
  collaboration: string;
  attendedEventIds: number[];
  role?: 'user' | 'admin' | 'superadmin';
}
