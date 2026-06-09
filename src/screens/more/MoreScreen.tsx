import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {InfoCard} from '../../components/InfoCard';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import {useResponsive} from '../../hooks/useResponsive';
import type {RootStackParamList} from '../../navigation/types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const menu: {
  title: string;
  subtitle: string;
  icon: string;
  route: keyof RootStackParamList;
}[] = [
  {
    title: 'Visit Plan',
    subtitle: 'Checklist, bookings, events, and saved venue areas',
    icon: '✓',
    route: 'VisitPlan',
  },
  {
    title: 'Guest Profile',
    subtitle: 'Personalize your pass and visit details',
    icon: 'ID',
    route: 'GuestProfile',
  },
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
  const responsive = useResponsive();

  return (
    <AppScreen withTabs>
      <ScreenHeader title="More" />
      <View style={[styles.list, responsive.isSmallHeight && styles.listSmall]}>
        {menu.map(item => (
          <Pressable
            key={item.title}
            onPress={() => navigation.navigate(item.route as never)}
            style={({pressed}) => pressed && styles.pressed}>
            <InfoCard
              style={[
                styles.card,
                responsive.isSmallHeight && styles.cardSmall,
              ]}>
              <View
                style={[
                  styles.iconBox,
                  responsive.isSmallHeight && styles.iconBoxSmall,
                ]}>
                <Text
                  style={[
                    styles.icon,
                    responsive.isSmallHeight && styles.iconSmall,
                  ]}>
                  {item.icon}
                </Text>
              </View>
              <View style={styles.textBlock}>
                <Text
                  style={[
                    styles.title,
                    responsive.isSmallHeight && styles.titleSmall,
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    responsive.isSmallHeight && styles.subtitleSmall,
                  ]}
                  numberOfLines={responsive.isSmallHeight ? 1 : 2}>
                  {item.subtitle}
                </Text>
              </View>
              <Text
                style={[
                  styles.chevron,
                  responsive.isSmallHeight && styles.chevronSmall,
                ]}>
                ›
              </Text>
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
  listSmall: {
    gap: 9,
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
  cardSmall: {
    minHeight: 54,
    padding: 10,
    gap: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSmall: {
    width: 34,
    height: 34,
  },
  icon: {
    fontSize: 18,
  },
  iconSmall: {
    fontSize: 16,
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
  titleSmall: {
    fontSize: 14,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 12,
    marginTop: 3,
  },
  subtitleSmall: {
    fontSize: 11,
    marginTop: 2,
  },
  chevron: {
    color: colors.textDim,
    fontSize: 24,
  },
  chevronSmall: {
    fontSize: 21,
  },
});
