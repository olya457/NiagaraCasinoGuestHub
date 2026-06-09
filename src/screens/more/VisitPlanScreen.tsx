import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
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
import {venueHalls} from '../../data/venueHalls';
import {visitTasks} from '../../data/visitPlan';
import type {RootStackParamList} from '../../navigation/types';
import {guestStorage} from '../../storage/guestStorage';
import type {
  BookingRecord,
  GuestProfile,
  VenueEvent,
  VenueHall,
  VisitTaskState,
} from '../../types';
import {getBookingDate, getTodayKey} from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitPlan'>;

export function VisitPlanScreen({navigation}: Props): React.JSX.Element {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [customEvents, setCustomEvents] = useState<VenueEvent[]>([]);
  const [savedHallIds, setSavedHallIds] = useState<string[]>([]);
  const [taskState, setTaskState] = useState<VisitTaskState>({});
  const todayBookingDate = getBookingDate(getTodayKey());

  const load = useCallback(() => {
    let mounted = true;
    Promise.all([
      guestStorage.getGuestProfile(),
      guestStorage.getBookings(),
      guestStorage.getSavedEvents(),
      guestStorage.getCustomEvents(),
      guestStorage.getSavedHalls(),
      guestStorage.getVisitTaskState(),
    ]).then(
      ([
        storedProfile,
        storedBookings,
        storedEventIds,
        storedCustomEvents,
        storedHallIds,
        storedTaskState,
      ]) => {
        if (mounted) {
          setProfile(storedProfile);
          setBookings(storedBookings);
          setSavedEventIds(storedEventIds);
          setCustomEvents(storedCustomEvents);
          setSavedHallIds(storedHallIds);
          setTaskState(storedTaskState);
        }
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  useFocusEffect(load);

  const savedEvents = useMemo(
    () =>
      [...events, ...customEvents].filter(event =>
        savedEventIds.includes(event.id),
      ),
    [customEvents, savedEventIds],
  );

  const savedHalls = useMemo(
    () => venueHalls.filter(hall => savedHallIds.includes(hall.id)),
    [savedHallIds],
  );

  const todayBookings = bookings.filter(
    booking => booking.date === todayBookingDate,
  );
  const hasProfile = Boolean(profile?.name.trim() || profile?.room.trim());

  const autoTaskState: VisitTaskState = {
    'profile-ready': hasProfile,
    'save-event': savedEvents.length > 0,
    'book-service': bookings.length > 0,
    'save-hall': savedHalls.length > 0,
  };

  const isTaskComplete = (taskId: string) =>
    Boolean(taskState[taskId] ?? autoTaskState[taskId]);

  const completedCount = visitTasks.filter(task =>
    isTaskComplete(task.id),
  ).length;
  const progress = Math.round((completedCount / visitTasks.length) * 100);

  const toggleTask = async (taskId: string) => {
    const nextValue = !isTaskComplete(taskId);
    setTaskState(current => ({...current, [taskId]: nextValue}));
    await guestStorage.setVisitTaskComplete(taskId, nextValue);
  };

  return (
    <AppScreen compactTop bottomExtra={32}>
      <ScreenHeader
        title="Visit Plan"
        back
        onBack={() => navigation.goBack()}
      />
      <InfoCard style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroLabel}>Plan Readiness</Text>
            <Text style={styles.heroTitle}>{progress}% Complete</Text>
            <Text style={styles.heroText}>
              {profile?.name.trim() || 'Guest Visitor'} ·{' '}
              {profile?.visitType || 'Leisure visit'}
            </Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>
              {completedCount}/{visitTasks.length}
            </Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {width: `${progress}%`}]} />
        </View>
      </InfoCard>

      <SectionTitle title="Today" />
      <View style={styles.summaryGrid}>
        <SummaryTile label="Bookings" value={String(todayBookings.length)} />
        <SummaryTile label="Saved Events" value={String(savedEvents.length)} />
        <SummaryTile label="Venue Areas" value={String(savedHalls.length)} />
      </View>

      <View style={styles.actionRow}>
        <PrimaryButton
          title="Browse Events"
          onPress={() =>
            navigation.navigate('MainTabs', {initialTab: 'events'})
          }
          style={styles.actionButton}
        />
        <PrimaryButton
          title="Book Service"
          variant="outline"
          onPress={() =>
            navigation.navigate('MainTabs', {initialTab: 'services'})
          }
          style={styles.actionButton}
        />
      </View>

      <SectionTitle title="Checklist" />
      <View style={styles.taskList}>
        {visitTasks.map(task => {
          const complete = isTaskComplete(task.id);
          return (
            <Pressable
              key={task.id}
              onPress={() => toggleTask(task.id)}
              style={({pressed}) => [
                styles.taskCard,
                complete && styles.taskCardComplete,
                pressed && styles.pressed,
              ]}>
              <View style={[styles.checkBox, complete && styles.checkBoxDone]}>
                <Text
                  style={[styles.checkText, complete && styles.checkTextDone]}>
                  {complete ? '✓' : ''}
                </Text>
              </View>
              <View style={styles.taskTextBlock}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDetail}>{task.detail}</Text>
              </View>
              <View
                style={[styles.taskAccent, {backgroundColor: task.accent}]}
              />
            </Pressable>
          );
        })}
      </View>

      <SectionTitle title="Saved Events" />
      {savedEvents.length === 0 ? (
        <EmptyState
          icon="★"
          title="No saved events"
          body="Save events from the calendar and they will appear in this plan."
          actionTitle="Browse Events"
          onAction={() =>
            navigation.navigate('MainTabs', {initialTab: 'events'})
          }
        />
      ) : (
        <View style={styles.list}>
          {savedEvents.slice(0, 3).map(event => (
            <PlanEventCard
              key={event.id}
              event={event}
              onPress={() =>
                navigation.navigate('EventDetail', {eventId: event.id})
              }
            />
          ))}
        </View>
      )}

      <SectionTitle title="Saved Venue Areas" />
      {savedHalls.length === 0 ? (
        <EmptyState
          icon="■"
          title="No venue areas saved"
          body="Open a hall detail page and add it to your visit plan."
          actionTitle="Explore Halls"
          onAction={() =>
            navigation.navigate('MainTabs', {initialTab: 'halls'})
          }
        />
      ) : (
        <View style={styles.list}>
          {savedHalls.slice(0, 3).map(hall => (
            <PlanHallCard
              key={hall.id}
              hall={hall}
              onPress={() =>
                navigation.navigate('HallDetail', {hallId: hall.id})
              }
            />
          ))}
        </View>
      )}

      <SectionTitle title="Profile" />
      <InfoCard style={styles.profileCard}>
        <Text style={styles.profileTitle}>
          {profile?.name.trim() || 'Guest Visitor'}
        </Text>
        <Text style={styles.profileMeta}>
          {profile?.room.trim() || 'Room not set'} ·{' '}
          {profile?.companion.trim() || 'Companion not set'}
        </Text>
        {profile?.note.trim() ? (
          <Text style={styles.profileNote}>{profile.note.trim()}</Text>
        ) : null}
        <PrimaryButton
          title="Edit Profile"
          variant="ghost"
          onPress={() => navigation.navigate('GuestProfile')}
          style={styles.profileButton}
        />
      </InfoCard>
    </AppScreen>
  );
}

function SectionTitle({title}: {title: string}): React.JSX.Element {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function SummaryTile({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <InfoCard style={styles.summaryTile}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </InfoCard>
  );
}

function PlanEventCard({
  event,
  onPress,
}: {
  event: VenueEvent;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => pressed && styles.pressed}>
      <InfoCard style={styles.planCard}>
        <View style={styles.cardTop}>
          <Badge label={event.type} tone={event.accent} />
          <Text style={styles.cardTime}>{event.time}</Text>
        </View>
        <Text style={styles.cardTitle}>{event.title}</Text>
        <Text style={styles.cardMeta}>
          {event.date} · {event.room}
        </Text>
      </InfoCard>
    </Pressable>
  );
}

function PlanHallCard({
  hall,
  onPress,
}: {
  hall: VenueHall;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => pressed && styles.pressed}>
      <InfoCard style={styles.planCard}>
        <View style={styles.cardTop}>
          <Badge label={hall.tag} tone={colors.gold} />
          <Text style={styles.cardTime}>Saved</Text>
        </View>
        <Text style={styles.cardTitle}>{hall.title}</Text>
        <Text style={styles.cardMeta}>{hall.location}</Text>
      </InfoCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: 16,
    borderColor: colors.borderGold,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroTextBlock: {
    flex: 1,
  },
  heroLabel: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 27,
    fontWeight: '800',
    marginTop: 8,
  },
  heroText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  scoreBadge: {
    width: 54,
    height: 54,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderGold,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 15,
    fontWeight: '900',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cardDeep,
    overflow: 'hidden',
    marginTop: 16,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 10,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryTile: {
    flex: 1,
    minHeight: 78,
    padding: 12,
    justifyContent: 'center',
  },
  summaryValue: {
    color: colors.gold,
    fontFamily: typography.display,
    fontSize: 24,
    fontWeight: '800',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
  },
  taskList: {
    gap: 10,
  },
  taskCard: {
    minHeight: 76,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskCardComplete: {
    borderColor: colors.borderGold,
    backgroundColor: colors.cardAlt,
  },
  checkBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxDone: {
    borderColor: colors.gold,
    backgroundColor: colors.gold,
  },
  checkText: {
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: '900',
  },
  checkTextDone: {
    color: colors.black,
  },
  taskTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  taskTitle: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: '900',
  },
  taskDetail: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  taskAccent: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  list: {
    gap: 10,
  },
  planCard: {
    padding: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardTime: {
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 11,
    fontWeight: '900',
  },
  cardTitle: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
  },
  cardMeta: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  profileCard: {
    padding: 14,
  },
  profileTitle: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 20,
    fontWeight: '800',
  },
  profileMeta: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    marginTop: 6,
  },
  profileNote: {
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  profileButton: {
    alignSelf: 'flex-start',
    minHeight: 38,
    marginTop: 14,
  },
  pressed: {
    opacity: 0.74,
  },
});
