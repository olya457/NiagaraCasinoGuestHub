import {colors} from '../constants/theme';
import type {VenueEvent} from '../types';
import {addDaysToKey, getLongDayName, getTodayKey} from '../utils/date';

const eventDate = (offset: number) => {
  const dateKey = addDaysToKey(getTodayKey(), offset);
  return {
    date: getLongDayName(dateKey),
    dateKey,
  };
};

export const events: VenueEvent[] = [
  {
    id: 'velvet-piano-night',
    title: 'Velvet Piano Night',
    room: 'Atrium Lounge',
    ...eventDate(0),
    time: '7:30 PM',
    type: 'Music Evening',
    guests: 'Up to 60 guests',
    dress: 'Smart Casual',
    summary:
      'A soft live piano session with lounge seating, drinks, and a calm casino-side mood.',
    description:
      'Settle into the Atrium Lounge for an evening of refined live piano music. The resident pianist performs a curated set of classics and contemporary pieces. Guests may arrive at any time during the session and enjoy lounge service throughout.',
    icon: '🎵',
    accent: colors.cyan,
  },
  {
    id: 'chefs-table-preview',
    title: "Chef's Table Preview",
    room: 'Fallsview Dining Hall',
    ...eventDate(0),
    time: '8:00 PM',
    type: 'Dining Event',
    guests: 'Up to 24 guests',
    dress: 'Smart Casual to Formal',
    summary:
      'A small tasting evening with selected dishes and dessert pairings.',
    description:
      'An intimate culinary event featuring a curated tasting menu by the resident chef team. The evening includes appetizers, main selections, and artisanal dessert pairings with beverage suggestions for each course.',
    icon: '🍽️',
    accent: colors.amber,
  },
  {
    id: 'night-hall-tour',
    title: 'Night Hall Tour',
    room: 'Guest Reception Gallery',
    ...eventDate(1),
    time: '9:15 PM',
    type: 'Guided Experience',
    guests: 'Up to 20 guests',
    dress: 'Casual',
    summary:
      'A short evening route through the main guest areas and photo-friendly venue corners.',
    description:
      'Join a guided evening walk through the main halls and signature areas of the venue. The Night Hall Tour covers the reception gallery, atrium, and casino perimeter, with stops at key architectural details and photo-friendly spots.',
    icon: '🚶',
    accent: colors.mint,
  },
  {
    id: 'casino-etiquette-talk',
    title: 'Casino Etiquette Mini Talk',
    room: 'Grand Casino Floor',
    ...eventDate(1),
    time: '6:45 PM',
    type: 'Guest Info',
    guests: 'Open to all guests',
    dress: 'Casual',
    summary:
      'A quick and friendly introduction to basic casino floor etiquette for new visitors.',
    description:
      'A friendly 20-minute session held near the main entrance of the Grand Casino Floor. Staff cover basic floor etiquette, how to navigate different zones, and tips for first-time visitors. Questions are welcome at the end.',
    icon: 'ℹ️',
    accent: colors.blue,
  },
  {
    id: 'private-celebration-showcase',
    title: 'Private Celebration Setup Showcase',
    room: 'Event Ballroom',
    ...eventDate(2),
    time: '5:30 PM',
    type: 'Decor Preview',
    guests: 'Up to 40 guests',
    dress: 'Smart Casual',
    summary:
      'A visual showcase of table settings, lighting options, and themed room layouts.',
    description:
      'Explore the full range of private event options available in the Event Ballroom. The showcase features live demonstrations of lighting setups, floral arrangements, table layouts, and themed decor configurations for celebrations of all kinds.',
    icon: '✨',
    accent: colors.rose,
  },
];
