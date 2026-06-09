import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  BookingRecord,
  GuestProfile,
  VenueEvent,
  VisitTaskState,
} from '../types';

const keys = {
  onboarding: 'ncgh:onboarding-complete',
  savedEvents: 'ncgh:saved-events',
  bookings: 'ncgh:bookings',
  customEvents: 'ncgh:custom-events',
  guestProfile: 'ncgh:guest-profile',
  visitTasks: 'ncgh:visit-tasks',
  savedHalls: 'ncgh:saved-halls',
  passId: 'ncgh:pass-id',
};

const defaultProfile: GuestProfile = {
  name: '',
  room: '',
  visitType: 'Leisure visit',
  arrivalDate: '',
  departureDate: '',
  companion: '',
  note: '',
};

const readJson = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = async <T>(key: string, value: T) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

const makePassId = () => {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(100000 + Math.random() * 900000).toString(36);
  return `NCGH-${year}-${randomPart.toUpperCase()}`;
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
  getGuestProfile: async () =>
    readJson<GuestProfile>(keys.guestProfile, defaultProfile),
  saveGuestProfile: async (profile: GuestProfile) =>
    writeJson(keys.guestProfile, {
      ...profile,
      updatedAt: new Date().toISOString(),
    }),
  getVisitTaskState: async () => readJson<VisitTaskState>(keys.visitTasks, {}),
  setVisitTaskComplete: async (taskId: string, completed: boolean) => {
    const taskState = await readJson<VisitTaskState>(keys.visitTasks, {});
    await writeJson(keys.visitTasks, {
      ...taskState,
      [taskId]: completed,
    });
  },
  resetVisitTasks: async () => writeJson<VisitTaskState>(keys.visitTasks, {}),
  getSavedHalls: async () => readJson<string[]>(keys.savedHalls, []),
  saveHall: async (hallId: string) => {
    const savedHalls = await readJson<string[]>(keys.savedHalls, []);
    if (!savedHalls.includes(hallId)) {
      await writeJson(keys.savedHalls, [...savedHalls, hallId]);
    }
  },
  removeHall: async (hallId: string) => {
    const savedHalls = await readJson<string[]>(keys.savedHalls, []);
    await writeJson(
      keys.savedHalls,
      savedHalls.filter(id => id !== hallId),
    );
  },
  getPassId: async () => {
    const stored = await AsyncStorage.getItem(keys.passId);
    if (stored) {
      return stored;
    }
    const passId = makePassId();
    await AsyncStorage.setItem(keys.passId, passId);
    return passId;
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
