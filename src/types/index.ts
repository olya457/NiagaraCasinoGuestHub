import type {ImageSourcePropType} from 'react-native';

export type VenueHall = {
  id: string;
  title: string;
  tag: string;
  category: string;
  description: string;
  highlights: string[];
  hours: string;
  location: string;
  image: ImageSourcePropType;
};

export type GuestProfile = {
  name: string;
  room: string;
  visitType: string;
  arrivalDate: string;
  departureDate: string;
  companion: string;
  note: string;
  updatedAt?: string;
};

export type GuestService = {
  id: string;
  title: string;
  tag: string;
  time: string;
  description: string;
  icon: string;
  accent: string;
};

export type VenueEvent = {
  id: string;
  title: string;
  room: string;
  date: string;
  dateKey: string;
  time: string;
  type: string;
  guests: string;
  dress: string;
  summary: string;
  description: string;
  icon: string;
  accent: string;
  custom?: boolean;
  createdAt?: string;
};

export type NearbyPlace = {
  id: string;
  title: string;
  tag: string;
  latitude: number;
  longitude: number;
  description: string;
  bestTime: string;
  tip: string;
  image: ImageSourcePropType;
};

export type FaqItem = {
  id: string;
  question: string;
  category: string;
  answer: string;
};

export type BookingRecord = {
  id: string;
  serviceId: string;
  serviceTitle: string;
  tag: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
};

export type VisitTask = {
  id: string;
  title: string;
  detail: string;
  accent: string;
};

export type VisitTaskState = Record<string, boolean>;
