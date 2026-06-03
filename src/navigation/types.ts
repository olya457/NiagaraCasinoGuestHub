import type {MainTabKey} from '../components/FloatingTabBar';

export type RootStackParamList = {
  MainTabs: {initialTab?: MainTabKey} | undefined;
  FullQr: undefined;
  HallDetail: {hallId: string};
  Booking: {serviceId: string};
  BookingSuccess: undefined;
  EventDetail: {eventId: string};
  CreateEvent: {dateKey: string};
  Faq: undefined;
  NearbyPlaces: undefined;
  NearbyPlaceDetail: {placeId: string};
  PlaceMap: {placeId: string};
  SavedEvents: undefined;
  MyBookings: undefined;
  GuestTips: undefined;
  AppInfo: undefined;
};
