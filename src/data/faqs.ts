import type {FaqItem} from '../types';

export const faqs: FaqItem[] = [
  {
    id: 'qr-pass',
    question: 'How do I use the QR Guest Pass?',
    category: 'Access',
    answer:
      'Open the QR Guest Pass screen, increase your brightness, and present the code when guest access is requested.',
  },
  {
    id: 'book-table',
    question: 'Can I book a restaurant table inside the app?',
    category: 'Booking',
    answer:
      'Yes. Open Book Services, choose Restaurant Table Booking, select date and time, and send your booking request.',
  },
  {
    id: 'main-halls',
    question: 'Where can I see the main halls?',
    category: 'Venue',
    answer:
      'Open Venue Halls to view photos, descriptions, tags, and details for each major area.',
  },
  {
    id: 'save-event',
    question: 'How do I save an event?',
    category: 'Events',
    answer:
      'Open Upcoming Events, choose an event, and tap Save Event on the detail screen.',
  },
  {
    id: 'nearby-places',
    question: 'Can I find places nearby?',
    category: 'Nearby',
    answer:
      'Yes. Open Nearby Places to view examples of attractions and useful places around the venue.',
  },
  {
    id: 'real-money',
    question: 'Is this app a real money gaming app?',
    category: 'Access',
    answer:
      'No. This app is designed as a guest information, venue guide, access, booking, and event planning hub.',
  },
];
