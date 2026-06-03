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

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

export function EventDetailScreen({
  route,
  navigation,
}: Props): React.JSX.Element {
  const eventId = route.params.eventId;
  const [event, setEvent] = useState<VenueEvent | null>(
    events.find(item => item.id === eventId) ?? null,
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      Promise.all([guestStorage.getSavedEvents(), guestStorage.getCustomEvents()]).then(
        ([ids, customEvents]) => {
          if (mounted) {
            const found =
              events.find(item => item.id === eventId) ??
              customEvents.find(item => item.id === eventId) ??
              null;
            setEvent(found);
            setSaved(found ? ids.includes(found.id) : false);
          }
        },
      );
      return () => {
        mounted = false;
      };
    }, [eventId]),
  );

  const toggleSave = async () => {
    if (!event || saving) {
      return;
    }
    setSaving(true);
    if (saved) {
      await guestStorage.removeEvent(event.id);
      setSaved(false);
    } else {
      await guestStorage.saveEvent(event.id);
      setSaved(true);
    }
    setSaving(false);
  };

  const deleteCustomEvent = async () => {
    if (!event || !event.custom) {
      return;
    }
    await guestStorage.removeCustomEvent(event.id);
    navigation.goBack();
  };

  if (!event) {
    return (
      <AppScreen compactTop>
        <ScreenHeader title="" back onBack={() => navigation.goBack()} />
        <EmptyState
          icon="📅"
          title="Event not found"
          body="This event is no longer available in the guest calendar."
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen compactTop>
      <ScreenHeader title="" back onBack={() => navigation.goBack()} />
      <Badge label={event.type} tone={event.accent} />
      <Text style={styles.title}>{event.title}</Text>
      <View style={styles.grid}>
        <MetaCard label="ROOM" value={event.room} />
        <MetaCard label="DATE" value={event.date} />
        <MetaCard label="TIME" value={event.time} />
        <MetaCard label="GUESTS" value={event.guests} />
        <MetaCard label="DRESS MOOD" value={event.dress} wide />
      </View>
      <Text style={styles.description}>{event.description}</Text>
      <PrimaryButton
        title={saved ? 'Saved ✓' : 'Save Event'}
        variant={saved ? 'ghost' : 'outline'}
        onPress={toggleSave}
        disabled={saving}
        style={[styles.button, saved && styles.savedButton]}
      />
      {event.custom ? (
        <PrimaryButton
          title="Delete Event"
          variant="ghost"
          onPress={deleteCustomEvent}
          style={styles.deleteButton}
        />
      ) : null}
    </AppScreen>
  );
}

function MetaCard({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}): React.JSX.Element {
  return (
    <InfoCard style={[styles.metaCard, wide && styles.wide]}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    marginTop: 12,
    marginBottom: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaCard: {
    width: '48.4%',
    minHeight: 72,
    padding: 14,
  },
  wide: {
    width: '48.4%',
  },
  metaLabel: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  metaValue: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  description: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 16,
    lineHeight: 25,
    marginTop: 22,
  },
  button: {
    marginTop: 28,
  },
  savedButton: {
    borderWidth: 1,
    borderColor: colors.mint,
  },
  deleteButton: {
    marginTop: 12,
  },
});
