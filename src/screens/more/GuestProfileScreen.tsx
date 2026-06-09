import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {CustomKeyboard} from '../../components/CustomKeyboard';
import {InfoCard} from '../../components/InfoCard';
import {PrimaryButton} from '../../components/PrimaryButton';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import type {RootStackParamList} from '../../navigation/types';
import {guestStorage} from '../../storage/guestStorage';
import type {GuestProfile} from '../../types';
import {addDaysToKey, getBookingDate, getTodayKey} from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'GuestProfile'>;
type ProfileField = keyof Pick<
  GuestProfile,
  'name' | 'room' | 'arrivalDate' | 'departureDate' | 'companion' | 'note'
>;

const visitTypes = [
  'Leisure visit',
  'Show night',
  'Dining plan',
  'Group visit',
  'Wellness stay',
];

const todayKey = getTodayKey();
const defaultArrival = getBookingDate(todayKey);
const defaultDeparture = getBookingDate(addDaysToKey(todayKey, 1));

export function GuestProfileScreen({navigation}: Props): React.JSX.Element {
  const [profile, setProfile] = useState<GuestProfile>({
    name: '',
    room: '',
    visitType: visitTypes[0],
    arrivalDate: defaultArrival,
    departureDate: defaultDeparture,
    companion: '',
    note: '',
  });
  const [saving, setSaving] = useState(false);
  const [activeField, setActiveField] = useState<ProfileField | null>(null);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      guestStorage.getGuestProfile().then(storedProfile => {
        if (mounted) {
          setProfile({
            ...storedProfile,
            arrivalDate: storedProfile.arrivalDate || defaultArrival,
            departureDate: storedProfile.departureDate || defaultDeparture,
            visitType: storedProfile.visitType || visitTypes[0],
          });
        }
      });
      return () => {
        mounted = false;
      };
    }, []),
  );

  const hasProfileDetails = useMemo(
    () => profile.name.trim().length > 0 || profile.room.trim().length > 0,
    [profile.name, profile.room],
  );

  const updateField = (field: ProfileField, value: string) => {
    setProfile(current => ({
      ...current,
      [field]: value.slice(0, field === 'note' ? 180 : 48),
    }));
  };

  const openField = (field: ProfileField) => {
    setActiveField(field);
  };

  const updateActiveField = (key: string) => {
    if (!activeField) {
      return;
    }

    if (key === 'done') {
      setActiveField(null);
      return;
    }

    if (key === 'clear') {
      updateField(activeField, '');
      return;
    }

    const currentValue = profile[activeField];

    if (key === 'delete') {
      updateField(activeField, currentValue.slice(0, -1));
      return;
    }

    const rawValue = key === 'space' ? ' ' : key;
    const dateField =
      activeField === 'arrivalDate' || activeField === 'departureDate';

    if (dateField && !/^[0-9/]$/.test(rawValue)) {
      return;
    }

    const nextChar =
      rawValue.length === 1 && /[A-Z]/.test(rawValue)
        ? currentValue.length === 0 ||
          /[\s./#&-]/.test(currentValue[currentValue.length - 1])
          ? rawValue
          : rawValue.toLowerCase()
        : rawValue;

    updateField(activeField, `${currentValue}${nextChar}`);
  };

  const save = async () => {
    if (saving) {
      return;
    }
    setSaving(true);
    await guestStorage.saveGuestProfile({
      ...profile,
      name: profile.name.trim(),
      room: profile.room.trim(),
      arrivalDate: profile.arrivalDate.trim(),
      departureDate: profile.departureDate.trim(),
      companion: profile.companion.trim(),
      note: profile.note.trim(),
    });
    setSaving(false);
    navigation.goBack();
  };

  return (
    <AppScreen compactTop bottomExtra={activeField ? 150 : 40}>
      <ScreenHeader
        title="Guest Profile"
        back
        onBack={() => navigation.goBack()}
      />
      <InfoCard style={styles.summary}>
        <Text style={styles.summaryLabel}>Visit Identity</Text>
        <Text style={styles.summaryTitle}>
          {profile.name.trim() || 'Guest Visitor'}
        </Text>
        <Text style={styles.summaryText}>
          {hasProfileDetails
            ? `${profile.room.trim() || 'Room not set'} · ${profile.visitType}`
            : 'Add the details you want available on your pass and plan.'}
        </Text>
      </InfoCard>
      <Field
        label="Guest Name"
        value={profile.name}
        placeholder="Guest name"
        active={activeField === 'name'}
        onPress={() => openField('name')}
      />
      {activeField === 'name' ? (
        <CustomKeyboard layout="profile" onKey={updateActiveField} />
      ) : null}
      <Field
        label="Room or Suite"
        value={profile.room}
        placeholder="Room, suite, or meeting point"
        active={activeField === 'room'}
        onPress={() => openField('room')}
      />
      {activeField === 'room' ? (
        <CustomKeyboard layout="profile" onKey={updateActiveField} />
      ) : null}
      <Text style={styles.label}>Visit Type</Text>
      <View style={styles.typeGrid}>
        {visitTypes.map(item => {
          const active = item === profile.visitType;
          return (
            <Pressable
              key={item}
              onPress={() => {
                setActiveField(null);
                setProfile(current => ({...current, visitType: item}));
              }}
              style={[styles.typePill, active && styles.typePillActive]}>
              <Text
                style={[styles.typeText, active && styles.typeTextActive]}
                numberOfLines={1}
                adjustsFontSizeToFit>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.dateRow}>
        <Field
          label="Arrival"
          value={profile.arrivalDate}
          placeholder={defaultArrival}
          active={activeField === 'arrivalDate'}
          onPress={() => openField('arrivalDate')}
          compact
        />
        <Field
          label="Departure"
          value={profile.departureDate}
          placeholder={defaultDeparture}
          active={activeField === 'departureDate'}
          onPress={() => openField('departureDate')}
          compact
        />
      </View>
      {activeField === 'arrivalDate' || activeField === 'departureDate' ? (
        <CustomKeyboard layout="number" onKey={updateActiveField} />
      ) : null}
      <Field
        label="Companion or Group"
        value={profile.companion}
        placeholder="Solo, couple, group, family"
        active={activeField === 'companion'}
        onPress={() => openField('companion')}
      />
      {activeField === 'companion' ? (
        <CustomKeyboard layout="profile" onKey={updateActiveField} />
      ) : null}
      <Field
        label="Visit Note"
        value={profile.note}
        placeholder="Accessibility, celebration, arrival note..."
        active={activeField === 'note'}
        onPress={() => openField('note')}
        multiline
      />
      {activeField === 'note' ? (
        <CustomKeyboard layout="profile" onKey={updateActiveField} />
      ) : null}
      <PrimaryButton
        title={saving ? 'Saving...' : 'Save Profile'}
        onPress={save}
        disabled={saving}
        style={styles.save}
      />
    </AppScreen>
  );
}

function Field({
  label,
  value,
  placeholder,
  active,
  onPress,
  multiline,
  compact,
}: {
  label: string;
  value: string;
  placeholder: string;
  active: boolean;
  onPress: () => void;
  multiline?: boolean;
  compact?: boolean;
}): React.JSX.Element {
  return (
    <View style={[styles.field, compact && styles.compactField]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={onPress}
        style={[
          styles.input,
          active && styles.inputActive,
          multiline && styles.inputMultiline,
        ]}>
        <Text
          style={[
            styles.inputText,
            !value && styles.placeholderText,
            multiline && styles.inputTextMultiline,
          ]}>
          {value || placeholder}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    padding: 16,
    borderColor: colors.borderGold,
    marginBottom: 8,
  },
  summaryLabel: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  summaryTitle: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
  },
  summaryText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  field: {
    marginTop: 12,
  },
  compactField: {
    flex: 1,
  },
  label: {
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardAlt,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  inputActive: {
    borderColor: colors.borderGold,
    backgroundColor: colors.card,
  },
  inputText: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 21,
  },
  placeholderText: {
    color: colors.textDim,
  },
  inputMultiline: {
    minHeight: 94,
    paddingTop: 14,
    justifyContent: 'flex-start',
  },
  inputTextMultiline: {
    lineHeight: 22,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typePill: {
    width: '48%',
    minHeight: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  typePillActive: {
    borderColor: colors.borderGold,
    backgroundColor: `${colors.gold}22`,
  },
  typeText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '800',
  },
  typeTextActive: {
    color: colors.gold,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
  },
  save: {
    marginTop: 18,
  },
});
