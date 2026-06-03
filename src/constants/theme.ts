import {Platform} from 'react-native';

export const colors = {
  background: '#020b07',
  backgroundSoft: '#06130d',
  card: '#102417',
  cardAlt: '#142c1d',
  cardDeep: '#0c1d13',
  gold: '#edc528',
  goldDark: '#9b7a0d',
  mint: '#21c989',
  cyan: '#2db6c7',
  blue: '#2776d4',
  violet: '#7d5ddc',
  rose: '#c24a8a',
  amber: '#bf8114',
  text: '#f7f1e5',
  textMuted: '#8fad9a',
  textDim: '#5f7d6b',
  border: '#203d2a',
  borderGold: '#6c5a14',
  black: '#000000',
  overlay: 'rgba(0, 7, 5, 0.68)',
  overlayDeep: 'rgba(0, 6, 4, 0.84)',
  white: '#ffffff',
};

export const typography = {
  display: Platform.select({ios: 'Georgia', android: 'serif', default: 'serif'}),
  body: Platform.select({ios: 'System', android: 'sans-serif', default: 'System'}),
};

export const layout = {
  screenPadding: 16,
  radius: 8,
  radiusLarge: 18,
  tabHeight: 66,
  tabBottomIos: 20,
  tabBottomAndroid: 30,
  androidEdge: 30,
};

export const topInset = (value: number) =>
  Platform.OS === 'android' ? Math.max(value, layout.androidEdge) : value;

export const bottomInset = (value: number) =>
  Platform.OS === 'android' ? Math.max(value, layout.androidEdge) : value;

export const tabBottomGap = () =>
  Platform.OS === 'android' ? layout.tabBottomAndroid : layout.tabBottomIos;
