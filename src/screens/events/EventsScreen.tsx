import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
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
import {
  getMonthTitle,
  getShortDayName,
  getWeekStart,
  makeDate,
  toDateKey,
} from '../../utils/date';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const todayKey = '2026-05-30';
const baseWeekOffset = 8;

const getSubtitle = (offset: number) => {
  if (offset === 0) {
    return 'Current week';
  }
  if (offset === 1) {
    return 'Next week';
  }
  if (offset === -1) {
    return 'Previous week';
  }
  return offset > 0 ? `${offset} weeks ahead` : `${Math.abs(offset)} weeks back`;
};

const buildWeek = (offset: number) => {
  const start = getWeekStart(makeDate(todayKey));
  start.setDate(start.getDate() + offset * 7);
  const days = Array.from({length: 7}, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      day: getShortDayName(date),
      date: String(date.getDate()),
      key: toDateKey(date),
    };
  });
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    title: getMonthTitle(start, end),
    subtitle: getSubtitle(offset),
    days,
  };
};

const calendarWeeks = Array.from({length: 25}, (_, index) =>
  buildWeek(index - baseWeekOffset),
);

export function EventsScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();
  const [saved, setSaved] = useState<string[]>([]);
  const [customEvents, setCustomEvents] = useState<VenueEvent[]>([]);
  const todayWeekIndex = calendarWeeks.findIndex(week =>
    week.days.some(day => day.key === todayKey),
  );
  const todayDayIndex =
    calendarWeeks[todayWeekIndex]?.days.findIndex(day => day.key === todayKey) ?? 0;
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(todayWeekIndex);
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayDayIndex);
  const selectedWeek = calendarWeeks[selectedWeekIndex];
  const selectedDay = selectedWeek.days[selectedDayIndex];
  const allEvents = useMemo(() => [...events, ...customEvents], [customEvents]);
  const selectedEvents = useMemo(
    () => allEvents.filter(event => event.dateKey === selectedDay.key),
    [allEvents, selectedDay.key],
  );
  const canGoPrevious = selectedWeekIndex > 0;
  const canGoNext = selectedWeekIndex < calendarWeeks.length - 1;
  const isTodaySelected = selectedDay.key === todayKey;
  const isNextWeekSelected = selectedWeekIndex > todayWeekIndex;

  useFocusEffect(
    useCallback(() => {
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
    }, []),
  );

  const selectToday = () => {
    setSelectedWeekIndex(todayWeekIndex);
    setSelectedDayIndex(todayDayIndex);
  };

  const moveWeek = (direction: -1 | 1) => {
    const next = Math.max(
      0,
      Math.min(calendarWeeks.length - 1, selectedWeekIndex + direction),
    );
    setSelectedWeekIndex(next);
    setSelectedDayIndex(Math.min(selectedDayIndex, calendarWeeks[next].days.length - 1));
  };

  const selectNextWeek = () => {
    const next = Math.min(calendarWeeks.length - 1, selectedWeekIndex + 1);
    setSelectedWeekIndex(next);
    setSelectedDayIndex(Math.min(selectedDayIndex, calendarWeeks[next].days.length - 1));
  };

  return (
    <AppScreen withTabs>
      <ScreenHeader title="Upcoming Events" />
      <View style={styles.monthRow}>
        <View>
          <Text style={styles.month}>{selectedWeek.title}</Text>
          <Text style={styles.submonth}>{selectedWeek.subtitle}</Text>
        </View>
        <View style={styles.arrows}>
          <Pressable
            disabled={!canGoPrevious}
            onPress={() => moveWeek(-1)}
            style={[styles.arrow, !canGoPrevious && styles.disabledControl]}>
            <Text style={[styles.arrowText, !canGoPrevious && styles.disabledText]}>‹</Text>
          </Pressable>
          <Pressable
            disabled={!canGoNext}
            onPress={() => moveWeek(1)}
            style={[styles.arrow, !canGoNext && styles.disabledControl]}>
            <Text style={[styles.arrowText, !canGoNext && styles.disabledText]}>›</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.week}>
        {selectedWeek.days.map((item, index) => {
          const active = selectedDay.key === item.key;
          const hasEvents = allEvents.some(event => event.dateKey === item.key);
          return (
            <Pressable
              key={item.key}
              onPress={() => setSelectedDayIndex(index)}
              style={[styles.day, active && styles.dayActive]}>
              <Text style={[styles.dayName, active && styles.activeText]}>{item.day}</Text>
              <Text style={[styles.dayDate, active && styles.activeText]}>{item.date}</Text>
              {hasEvents ? <View style={styles.dayDot} /> : null}
            </Pressable>
          );
        })}
      </View>
      <View style={styles.quickRow}>
        <Pressable
          onPress={selectToday}
          style={[styles.quickPill, isTodaySelected && styles.quickPillActive]}>
          <Text style={[styles.quickText, isTodaySelected && styles.quickTextActive]}>
            Today
          </Text>
        </Pressable>
        <Pressable
          disabled={!canGoNext}
          onPress={selectNextWeek}
          style={[
            styles.quickPill,
            isNextWeekSelected && styles.quickPillActive,
            !canGoNext && styles.disabledControl,
          ]}>
          <Text
            style={[
              styles.quickText,
              isNextWeekSelected && styles.quickTextActive,
              !canGoNext && styles.disabledText,
            ]}>
            Next Week
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('CreateEvent', {dateKey: selectedDay.key})}
          style={[styles.quickPill, styles.addPill]}>
          <Text style={[styles.quickText, styles.addText]}>Add Event</Text>
        </Pressable>
      </View>
      {selectedEvents.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No events on this date"
          body="Add a guest event or choose another highlighted date."
          actionTitle="Add Event"
          onAction={() => navigation.navigate('CreateEvent', {dateKey: selectedDay.key})}
        />
      ) : (
        <View style={styles.list}>
          {selectedEvents.map(event => (
            <InfoCard key={event.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Badge label={event.type} tone={event.accent} />
                <View style={[styles.iconBox, {borderColor: `${event.accent}66`}]}>
                  <Text style={styles.icon}>{saved.includes(event.id) ? '✓' : event.icon}</Text>
                </View>
              </View>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.meta}>
                {event.date} · {event.time} · {event.room}
              </Text>
              <Text style={styles.summary}>{event.summary}</Text>
              <PrimaryButton
                title="View Event"
                variant="outline"
                onPress={() => navigation.navigate('EventDetail', {eventId: event.id})}
                style={styles.button}
              />
            </InfoCard>
          ))}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  month: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 20,
    fontWeight: '800',
  },
  submonth: {
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 12,
    marginTop: 2,
  },
  arrows: {
    flexDirection: 'row',
    gap: 8,
  },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: colors.textMuted,
    fontSize: 22,
  },
  disabledControl: {
    opacity: 0.45,
  },
  disabledText: {
    color: colors.textDim,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  day: {
    flex: 1,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayActive: {
    backgroundColor: colors.card,
    borderColor: colors.borderGold,
  },
  dayName: {
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 10,
    fontWeight: '800',
  },
  dayDate: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 6,
  },
  activeText: {
    color: colors.gold,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.mint,
    marginTop: 5,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
    marginBottom: 8,
  },
  quickPill: {
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  quickPillActive: {
    borderColor: colors.borderGold,
    backgroundColor: colors.cardDeep,
  },
  addPill: {
    borderColor: colors.borderGold,
  },
  quickText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontWeight: '700',
  },
  quickTextActive: {
    color: colors.gold,
  },
  addText: {
    color: colors.gold,
  },
  list: {
    gap: 14,
    marginTop: 2,
  },
  card: {
    padding: 16,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardAlt,
  },
  icon: {
    color: colors.mint,
    fontSize: 15,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 12,
  },
  meta: {
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 13,
    marginTop: 5,
  },
  summary: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  button: {
    alignSelf: 'flex-start',
    minHeight: 42,
    marginTop: 16,
  },
});
