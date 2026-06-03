import AsyncStorage from '@react-native-async-storage/async-storage';
import type {BookingRecord, VenueEvent} from '../types';

const keys = {
  onboarding: 'ncgh:onboarding-complete',
  savedEvents: 'ncgh:saved-events',
  bookings: 'ncgh:bookings',
  customEvents: 'ncgh:custom-events',
};

const readJson = async <T,>(key: string, fallback: T): Promise<T> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = async <T,>(key: string, value: T) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const guestStorage = {
  getOnboardingComplete: async () =>
    (await AsyncStorage.getItem(keys.onboarding)) === 'true',
  setOnboardingComplete: async () =>
    AsyncStorage.setItem(keys.onboarding, 'true'),
  getSavedEvents: async () => readJson<string[]>(keys.savedEvents, []),
  saveEvent: async (eventId: string) => {
    const saved = await readJson<string[]>(keys.savedEvents, []);
    if (!saved.includes(eventId)) {
      await writeJson(keys.savedEvents, [...saved, eventId]);
    }
  },
  removeEvent: async (eventId: string) => {
    const saved = await readJson<string[]>(keys.savedEvents, []);
    await writeJson(
      keys.savedEvents,
      saved.filter(id => id !== eventId),
    );
  },
  getCustomEvents: async () => readJson<VenueEvent[]>(keys.customEvents, []),
  addCustomEvent: async (event: VenueEvent) => {
    const savedEvents = await readJson<VenueEvent[]>(keys.customEvents, []);
    await writeJson(keys.customEvents, [event, ...savedEvents]);
  },
  removeCustomEvent: async (eventId: string) => {
    const customEvents = await readJson<VenueEvent[]>(keys.customEvents, []);
    await writeJson(
      keys.customEvents,
      customEvents.filter(item => item.id !== eventId),
    );
    const saved = await readJson<string[]>(keys.savedEvents, []);
    await writeJson(
      keys.savedEvents,
      saved.filter(id => id !== eventId),
    );
  },
  getBookings: async () => readJson<BookingRecord[]>(keys.bookings, []),
  addBooking: async (booking: BookingRecord) => {
    const bookings = await readJson<BookingRecord[]>(keys.bookings, []);
    await writeJson(keys.bookings, [booking, ...bookings]);
  },
  removeBooking: async (bookingId: string) => {
    const bookings = await readJson<BookingRecord[]>(keys.bookings, []);
    await writeJson(
      keys.bookings,
      bookings.filter(item => item.id !== bookingId),
    );
  },
};
