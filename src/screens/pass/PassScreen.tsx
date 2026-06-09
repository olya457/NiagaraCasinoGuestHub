import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {InfoCard} from '../../components/InfoCard';
import {PrimaryButton} from '../../components/PrimaryButton';
import {QrMatrix} from '../../components/QrMatrix';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import {events} from '../../data/events';
import {visitTasks} from '../../data/visitPlan';
import {useResponsive} from '../../hooks/useResponsive';
import type {RootStackParamList} from '../../navigation/types';
import {guestStorage} from '../../storage/guestStorage';
import type {
  BookingRecord,
  GuestProfile,
  VenueEvent,
  VisitTaskState,
} from '../../types';
import {getDateTitle, getTodayKey} from '../../utils/date';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const notes = [
  'Use the full-screen pass when a staff member asks for your guest code.',
  'Update your guest profile before arrival so your plan stays personalized.',
  'Saved events, bookings, and venue areas are stored on this device.',
];

export function PassScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();
  const responsive = useResponsive();
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [passId, setPassId] = useState('NCGH');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [customEvents, setCustomEvents] = useState<VenueEvent[]>([]);
  const [savedHallIds, setSavedHallIds] = useState<string[]>([]);
  const [taskState, setTaskState] = useState<VisitTaskState>({});
  const todayKey = getTodayKey();
  const todayTitle = getDateTitle(todayKey);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      Promise.all([
        guestStorage.getGuestProfile(),
        guestStorage.getPassId(),
        guestStorage.getBookings(),
        guestStorage.getSavedEvents(),
        guestStorage.getCustomEvents(),
        guestStorage.getSavedHalls(),
        guestStorage.getVisitTaskState(),
      ]).then(
        ([
          storedProfile,
          storedPassId,
          storedBookings,
          storedEventIds,
          storedCustomEvents,
          storedHallIds,
          storedTaskState,
        ]) => {
          if (mounted) {
            setProfile(storedProfile);
            setPassId(storedPassId);
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
    }, []),
  );

  const savedEvents = useMemo(
    () =>
      [...events, ...customEvents].filter(event =>
        savedEventIds.includes(event.id),
      ),
    [customEvents, savedEventIds],
  );

  const guestName = profile?.name.trim() || 'Guest Visitor';
  const guestRoom = profile?.room.trim() || 'Room not set';
  const hasProfile = Boolean(profile?.name.trim() || profile?.room.trim());
  const autoTaskState: VisitTaskState = {
    'profile-ready': hasProfile,
    'save-event': savedEvents.length > 0,
    'book-service': bookings.length > 0,
    'save-hall': savedHallIds.length > 0,
  };
  const isTaskComplete = (taskId: string) =>
    Boolean(taskState[taskId] ?? autoTaskState[taskId]);
  const completedCount = visitTasks.filter(task =>
    isTaskComplete(task.id),
  ).length;
  const progress = Math.round((completedCount / visitTasks.length) * 100);
  const passPayload = [
    'Niagara Casino Guest Hub',
    passId,
    guestName,
    guestRoom,
    todayKey,
  ].join('|');

  return (
    <AppScreen withTabs>
      <ScreenHeader
        title="Guest Pass"
        subtitle="Your digital pass, visit profile, and personal plan in one place."
      />
      <Pressable
        onPress={() => navigation.navigate('FullQr')}
        style={[
          styles.card,
          responsive.isSmallHeight && styles.cardSmall,
          responsive.isNarrow && styles.cardNarrow,
        ]}>
        <View style={styles.cardTop}>
          <View style={styles.cardIdentity}>
            <Text
              style={[
                styles.kicker,
                responsive.isSmallHeight && styles.kickerSmall,
              ]}>
              DIGITAL GUEST PASS
            </Text>
            <Text
              style={[
                styles.cardName,
                responsive.isSmallHeight && styles.cardNameSmall,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit>
              {guestName}
            </Text>
            <Text style={styles.roomText} numberOfLines={1}>
              {guestRoom} · {profile?.visitType || 'Leisure visit'}
            </Text>
          </View>
          <View
            style={[
              styles.statusPill,
              responsive.isNarrow && styles.statusPillNarrow,
            ]}>
            <Text
              style={[
                styles.statusText,
                responsive.isNarrow && styles.statusTextNarrow,
              ]}>
              Valid Today
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.qrWrap,
            responsive.isSmallHeight && styles.qrWrapSmall,
          ]}>
          <QrMatrix size={responsive.qrSize} payload={passPayload} />
        </View>
        <View style={styles.cardBottom}>
          <View style={styles.passMetaBlock}>
            <Text style={styles.metaLabel}>PASS ID</Text>
            <Text
              style={[
                styles.passId,
                responsive.isNarrow && styles.passIdNarrow,
              ]}>
              {passId}
            </Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={[styles.metaLabel, styles.rightText]}>DATE</Text>
            <Text style={styles.valid}>{todayTitle}</Text>
          </View>
        </View>
        <Text style={[styles.tap, responsive.isSmallHeight && styles.tapSmall]}>
          Tap to open full screen
        </Text>
      </Pressable>
      <PrimaryButton
        title="Show Full Screen QR"
        onPress={() => navigation.navigate('FullQr')}
        style={[styles.button, responsive.isSmallHeight && styles.buttonSmall]}
      />

      <View style={styles.quickRow}>
        <PrimaryButton
          title="Visit Plan"
          variant="outline"
          onPress={() => navigation.navigate('VisitPlan')}
          style={styles.quickButton}
        />
        <PrimaryButton
          title="Edit Profile"
          variant="ghost"
          onPress={() => navigation.navigate('GuestProfile')}
          style={styles.quickButton}
        />
      </View>

      <Text
        style={[
          styles.sectionTitle,
          responsive.isSmallHeight && styles.sectionTitleSmall,
        ]}>
        Visit Snapshot
      </Text>
      <View style={styles.statsGrid}>
        <StatCard label="Bookings" value={String(bookings.length)} />
        <StatCard label="Saved Events" value={String(savedEvents.length)} />
        <StatCard label="Venue Areas" value={String(savedHallIds.length)} />
      </View>

      <InfoCard style={styles.planCard}>
        <View style={styles.planTop}>
          <View>
            <Text style={styles.planLabel}>Plan Progress</Text>
            <Text style={styles.planTitle}>
              {completedCount}/{visitTasks.length} steps ready
            </Text>
          </View>
          <Text style={styles.planPercent}>{progress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {width: `${progress}%`}]} />
        </View>
        <View style={styles.taskPreview}>
          {visitTasks.slice(0, 3).map(task => {
            const complete = isTaskComplete(task.id);
            return (
              <View key={task.id} style={styles.taskRow}>
                <Text
                  style={[styles.taskMark, complete && styles.taskMarkDone]}>
                  {complete ? '✓' : '○'}
                </Text>
                <Text
                  style={[styles.taskText, complete && styles.taskTextDone]}
                  numberOfLines={1}>
                  {task.title}
                </Text>
              </View>
            );
          })}
        </View>
      </InfoCard>

      <Text
        style={[
          styles.sectionTitle,
          responsive.isSmallHeight && styles.sectionTitleSmall,
        ]}>
        Pass Notes
      </Text>
      <View style={styles.notes}>
        {notes.map(note => (
          <View
            key={note}
            style={[
              styles.noteRow,
              responsive.isSmallHeight && styles.noteRowSmall,
            ]}>
            <Text style={styles.bullet}>•</Text>
            <Text
              style={[
                styles.note,
                responsive.isSmallHeight && styles.noteSmall,
              ]}>
              {note}
            </Text>
          </View>
        ))}
      </View>
    </AppScreen>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <InfoCard style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderGold,
    backgroundColor: colors.cardAlt,
    padding: 24,
    overflow: 'hidden',
  },
  cardNarrow: {
    padding: 18,
  },
  cardSmall: {
    padding: 18,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
  },
  cardIdentity: {
    flex: 1,
    minWidth: 0,
  },
  kicker: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  kickerSmall: {
    fontSize: 10,
    letterSpacing: 1,
  },
  cardName: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 7,
  },
  cardNameSmall: {
    fontSize: 19,
    marginTop: 5,
  },
  roomText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 12,
    marginTop: 4,
  },
  statusPill: {
    borderRadius: 12,
    backgroundColor: 'rgba(33, 201, 137, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusPillNarrow: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: colors.mint,
    fontFamily: typography.body,
    fontSize: 11,
    fontWeight: '800',
  },
  statusTextNarrow: {
    fontSize: 10,
  },
  qrWrap: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 26,
  },
  qrWrapSmall: {
    marginTop: 16,
    marginBottom: 18,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  passMetaBlock: {
    flex: 1,
    minWidth: 0,
  },
  dateBlock: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  metaLabel: {
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  rightText: {
    textAlign: 'right',
  },
  passId: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 6,
  },
  passIdNarrow: {
    fontSize: 13,
    letterSpacing: 0,
  },
  valid: {
    color: colors.mint,
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 6,
  },
  tap: {
    color: colors.textDim,
    fontFamily: typography.body,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
  },
  tapSmall: {
    marginTop: 14,
    fontSize: 11,
  },
  button: {
    marginTop: 18,
  },
  buttonSmall: {
    marginTop: 12,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  quickButton: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitleSmall: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minHeight: 76,
    padding: 12,
    justifyContent: 'center',
  },
  statValue: {
    color: colors.gold,
    fontFamily: typography.display,
    fontSize: 23,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
  planCard: {
    padding: 14,
    marginTop: 12,
  },
  planTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  planLabel: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  planTitle: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
  planPercent: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 18,
    fontWeight: '900',
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.cardDeep,
    overflow: 'hidden',
    marginTop: 14,
  },
  progressFill: {
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  taskPreview: {
    gap: 8,
    marginTop: 14,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskMark: {
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '900',
  },
  taskMarkDone: {
    color: colors.mint,
  },
  taskText: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
  },
  taskTextDone: {
    color: colors.text,
  },
  notes: {
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 15,
  },
  noteRowSmall: {
    paddingVertical: 11,
  },
  bullet: {
    color: colors.gold,
    fontSize: 22,
    lineHeight: 22,
  },
  note: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  noteSmall: {
    fontSize: 13,
    lineHeight: 19,
  },
});
