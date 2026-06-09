import {colors} from '../constants/theme';
import type {VisitTask} from '../types';

export const visitTasks: VisitTask[] = [
  {
    id: 'profile-ready',
    title: 'Complete guest profile',
    detail: 'Add your name, room, visit type, and arrival details.',
    accent: colors.gold,
  },
  {
    id: 'save-event',
    title: 'Save an event',
    detail: 'Pick at least one event for your personal visit plan.',
    accent: colors.cyan,
  },
  {
    id: 'book-service',
    title: 'Request a service',
    detail: 'Send a dining, concierge, tour, or housekeeping request.',
    accent: colors.mint,
  },
  {
    id: 'save-hall',
    title: 'Choose a venue area',
    detail: 'Save a hall, lounge, dining area, or guest space to revisit.',
    accent: colors.violet,
  },
  {
    id: 'review-tips',
    title: 'Review guest tips',
    detail: 'Check helpful visit notes before arriving at the venue.',
    accent: colors.amber,
  },
  {
    id: 'nearby-stop',
    title: 'Plan a nearby stop',
    detail: 'Browse one Niagara attraction or walking stop near the venue.',
    accent: colors.rose,
  },
];
