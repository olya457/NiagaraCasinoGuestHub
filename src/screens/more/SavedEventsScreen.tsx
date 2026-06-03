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
import {events} from '../../data/events';
import type {RootStackParamList} from '../../navigation/types';
import {guestStorage} from '../../storage/guestStorage';
import type {VenueEvent} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedEvents'>;

export function SavedEventsScreen({navigation}: Props): React.JSX.Element {
  const [saved, setSaved] = useState<string[]>([]);
  const [customEvents, setCustomEvents] = useState<VenueEvent[]>([]);

  const load = useCallback(() => {
    let mounted = true;
    Promise.all([guestStorage.getSavedEvents(), guestStorage.getCustomEvents()]).then(
      ([ids, storedEvents]) => {
        if (mounted) {
          setSaved(ids);
          setCustomEvents(storedEvents);
        }
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  useFocusEffect(load);

  const savedEvents = [...events, ...customEvents].filter(event =>
    saved.includes(event.id),
  );

  const remove = async (eventId: string) => {
    await guestStorage.removeEvent(eventId);
    setSaved(ids => ids.filter(id => id !== eventId));
  };

  return (
    <AppScreen compactTop>
      <ScreenHeader title="Saved Events" back onBack={() => navigation.goBack()} />
      {savedEvents.length === 0 ? (
        <EmptyState
          icon="★"
          title="No saved events yet"
          body="Save events from the Upcoming Events screen to build your mini plan."
          actionTitle="Browse Events"
          onAction={() => navigation.navigate('MainTabs', {initialTab: 'events'})}
        />
      ) : (
        <View style={styles.list}>
          {savedEvents.map(event => (
            <InfoCard key={event.id} style={styles.card}>
              <View style={styles.topRow}>
                <Badge label={event.type} tone={event.accent} />
                <Text style={styles.savedLabel}>Saved</Text>
              </View>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.meta}>
                {event.date} · {event.time} · {event.room}
              </Text>
              <PrimaryButton
                title="Remove"
                variant="outline"
                onPress={() => remove(event.id)}
                style={styles.remove}
              />
              <PrimaryButton
                title="View Event"
                variant="ghost"
                onPress={() => navigation.navigate('EventDetail', {eventId: event.id})}
                style={styles.view}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  savedLabel: {
    color: colors.gold,
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
  remove: {
    alignSelf: 'flex-start',
    minHeight: 38,
    marginTop: 14,
  },
  view: {
    alignSelf: 'flex-start',
    minHeight: 38,
    marginTop: 10,
  },
});
