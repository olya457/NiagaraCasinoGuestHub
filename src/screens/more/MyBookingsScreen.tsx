import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {Badge} from '../../components/Badge';
import {EmptyState} from '../../components/EmptyState';
import {InfoCard} from '../../components/InfoCard';
import {PrimaryButton} from '../../components/PrimaryButton';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import type {RootStackParamList} from '../../navigation/types';
import {guestStorage} from '../../storage/guestStorage';
import type {BookingRecord} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'MyBookings'>;

export function MyBookingsScreen({navigation}: Props): React.JSX.Element {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  const load = useCallback(() => {
    let mounted = true;
    guestStorage.getBookings().then(items => {
      if (mounted) {
        setBookings(items);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useFocusEffect(load);

  const remove = async (bookingId: string) => {
    await guestStorage.removeBooking(bookingId);
    setBookings(items => items.filter(item => item.id !== bookingId));
  };

  return (
    <AppScreen compactTop>
      <ScreenHeader title="My Bookings" back onBack={() => navigation.goBack()} />
      {bookings.length === 0 ? (
        <EmptyState
          icon="■"
          title="No booking requests yet"
          body="Choose a service and send your first request."
          actionTitle="Book a Service"
          onAction={() => navigation.navigate('MainTabs', {initialTab: 'services'})}
        />
      ) : (
        <View style={styles.list}>
          {bookings.map(booking => (
            <InfoCard key={booking.id} style={styles.card}>
              <View style={styles.topRow}>
                <Badge label={booking.tag} tone={colors.gold} />
                <Text style={styles.status}>Request Sent</Text>
              </View>
              <Text style={styles.title}>{booking.serviceTitle}</Text>
              <Text style={styles.meta}>
                {booking.date} · {booking.time}
              </Text>
              {booking.notes ? <Text style={styles.notes}>{booking.notes}</Text> : null}
              <PrimaryButton
                title="Delete"
                variant="outline"
                onPress={() => remove(booking.id)}
                style={styles.remove}
              />
            </InfoCard>
          ))}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  card: {
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  status: {
    color: colors.mint,
    fontFamily: typography.body,
    fontSize: 11,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
  },
  meta: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    marginTop: 6,
  },
  notes: {
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  remove: {
    alignSelf: 'flex-start',
    minHeight: 38,
    marginTop: 14,
  },
});
