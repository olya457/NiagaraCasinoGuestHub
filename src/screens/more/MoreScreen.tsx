import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {InfoCard} from '../../components/InfoCard';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import type {RootStackParamList} from '../../navigation/types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const menu: {
  title: string;
  subtitle: string;
  icon: string;
  route: keyof RootStackParamList;
}[] = [
  {
    title: 'QR & Help',
    subtitle: 'Quick answers for common questions',
    icon: '❔',
    route: 'Faq',
  },
  {
    title: 'Nearby Places',
    subtitle: 'Discover places around the venue',
    icon: '📍',
    route: 'NearbyPlaces',
  },
  {
    title: 'Saved Events',
    subtitle: 'Events you saved to your plan',
    icon: '💚',
    route: 'SavedEvents',
  },
  {
    title: 'My Bookings',
    subtitle: 'View your booking requests',
    icon: '📋',
    route: 'MyBookings',
  },
  {
    title: 'Guest Tips',
    subtitle: 'Useful tips for your visit',
    icon: '💡',
    route: 'GuestTips',
  },
  {
    title: 'App Info',
    subtitle: 'About this guest hub',
    icon: 'ℹ️',
    route: 'AppInfo',
  },
];

export function MoreScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();

  return (
    <AppScreen withTabs>
      <ScreenHeader title="More" />
      <View style={styles.list}>
        {menu.map(item => (
          <Pressable
            key={item.title}
            onPress={() => navigation.navigate(item.route as never)}
            style={({pressed}) => pressed && styles.pressed}>
            <InfoCard style={styles.card}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <View style={styles.textBlock}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </InfoCard>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  pressed: {
    opacity: 0.74,
  },
  card: {
    minHeight: 62,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 15,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 12,
    marginTop: 3,
  },
  chevron: {
    color: colors.textDim,
    fontSize: 24,
  },
});
