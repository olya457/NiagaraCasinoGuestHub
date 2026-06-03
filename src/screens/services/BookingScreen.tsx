import React, {useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {Badge} from '../../components/Badge';
import {CustomKeyboard} from '../../components/CustomKeyboard';
import {InfoCard} from '../../components/InfoCard';
import {PrimaryButton} from '../../components/PrimaryButton';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import {services} from '../../data/services';
import {useResponsive} from '../../hooks/useResponsive';
import type {RootStackParamList} from '../../navigation/types';
import {guestStorage} from '../../storage/guestStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'Booking'>;
type PickerName = 'date' | 'time';

const dateOptions = Array.from({length: 10}, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() + index);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
});

const timeOptionsByService: Record<string, string[]> = {
  'restaurant-table': [
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
    '9:00 PM',
    '9:30 PM',
    '10:00 PM',
    '10:30 PM',
    '11:00 PM',
    '11:30 PM',
  ],
  'private-lounge': [
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
    '10:00 PM',
    '11:00 PM',
    '12:00 AM',
  ],
  'guided-tour': [
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
  ],
  'room-cleaning': [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
  ],
  'luggage-assistance': [
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '12:00 PM',
    '2:00 PM',
    '4:00 PM',
    '6:00 PM',
    '8:00 PM',
  ],
  'laundry-service': [
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '11:00 AM',
    '1:00 PM',
    '3:00 PM',
    '5:00 PM',
    '7:00 PM',
  ],
};

const flexibleTimeOptions = [
  'By request',
  'On request',
  'Any time',
  'Morning',
  'Afternoon',
  'Evening',
];

export function BookingScreen({route, navigation}: Props): React.JSX.Element {
  const service =
    services.find(item => item.id === route.params.serviceId) ?? services[0];
  const responsive = useResponsive();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [openPicker, setOpenPicker] = useState<PickerName | null>(null);
  const [notesKeyboardOpen, setNotesKeyboardOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const timeOptions = timeOptionsByService[service.id] ?? flexibleTimeOptions;
  const canSubmit = useMemo(
    () => date.trim().length > 0 && time.trim().length > 0,
    [date, time],
  );

  const updateNotes = (value: string) => {
    if (value === 'done') {
      setNotesKeyboardOpen(false);
      return;
    }

    if (value === 'clear') {
      setNotes('');
      return;
    }

    if (value === 'delete') {
      setNotes(current => current.slice(0, -1));
      return;
    }

    const nextValue = value === 'space' ? ' ' : value.toLowerCase();
    setNotes(current => `${current}${nextValue}`.slice(0, 160));
  };

  const togglePicker = (picker: PickerName) => {
    setNotesKeyboardOpen(false);
    setOpenPicker(current => (current === picker ? null : picker));
  };

  const openNotesKeyboard = () => {
    setOpenPicker(null);
    setNotesKeyboardOpen(true);
  };

  const submit = async () => {
    if (!canSubmit || saving) {
      return;
    }
    setSaving(true);
    await guestStorage.addBooking({
      id: `${service.id}-${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      tag: service.tag,
      date: date.trim(),
      time: time.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    });
    setSaving(false);
    navigation.replace('BookingSuccess');
  };

  return (
    <AppScreen
      compactTop
      bottomExtra={responsive.isSmallHeight ? 120 : 80}>
      <ScreenHeader
        title="Book Service"
        back
        onBack={() => navigation.goBack()}
      />
      <InfoCard style={styles.summary}>
        <Badge label={service.tag} tone={service.accent} />
        <Text style={styles.serviceTitle}>{service.title}</Text>
        <Text style={styles.serviceTime}>{service.time}</Text>
      </InfoCard>
      <FormField
        label="Date"
        value={date}
        placeholder="mm/dd/yyyy"
        icon="📅"
        active={openPicker === 'date'}
        onPress={() => togglePicker('date')}
      />
      {openPicker === 'date' ? (
        <PickerList
          options={dateOptions}
          value={date}
          onSelect={value => {
            setDate(value);
            setOpenPicker(null);
          }}
        />
      ) : null}
      <FormField
        label="Time"
        value={time}
        placeholder="--:-- --"
        icon="🕘"
        active={openPicker === 'time'}
        onPress={() => togglePicker('time')}
      />
      {openPicker === 'time' ? (
        <PickerList
          options={timeOptions}
          value={time}
          onSelect={value => {
            setTime(value);
            setOpenPicker(null);
          }}
        />
      ) : null}
      <DataField
        label="Notes (optional)"
        value={notes}
        placeholder="Any special requests..."
        icon="✏️"
        active={notesKeyboardOpen}
        onPress={openNotesKeyboard}
        multiline
      />
      {notesKeyboardOpen ? (
        <CustomKeyboard onKey={updateNotes} />
      ) : null}
      <PrimaryButton
        title={saving ? 'Sending...' : 'Confirm Booking'}
        onPress={submit}
        disabled={!canSubmit || saving}
        style={styles.submit}
      />
    </AppScreen>
  );
}

function PickerList({
  options,
  value,
  onSelect,
}: {
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}): React.JSX.Element {
  return (
    <View style={styles.pickerList}>
      {options.map(option => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.pickerItem, active && styles.pickerItemActive]}>
            <Text
              style={[styles.pickerText, active && styles.pickerTextActive]}
              numberOfLines={1}
              adjustsFontSizeToFit>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function FormField({
  label,
  value,
  placeholder,
  icon,
  active,
  onPress,
}: {
  label: string;
  value: string;
  placeholder: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <DataField
      label={label}
      value={value}
      placeholder={placeholder}
      icon={icon}
      active={active}
      onPress={onPress}
    />
  );
}

function DataField({
  label,
  value,
  placeholder,
  icon,
  active,
  onPress,
  multiline,
}: {
  label: string;
  value: string;
  placeholder: string;
  icon: string;
  active: boolean;
  onPress: () => void;
  multiline?: boolean;
}): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          active && styles.inputActive,
          multiline && styles.notes,
        ]}>
        <Text
          style={[
            styles.inputInline,
            !value && styles.placeholder,
            multiline && styles.notesText,
          ]}>
          {value || placeholder}
        </Text>
        <Pressable onPress={onPress} hitSlop={10} style={styles.iconButton}>
          <Text style={styles.inputIcon}>{icon}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    padding: 16,
    marginBottom: 18,
    borderColor: colors.borderGold,
  },
  serviceTitle: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    marginTop: 12,
  },
  serviceTime: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    marginTop: 4,
  },
  field: {
    marginTop: 12,
  },
  label: {
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },
  inputWrap: {
    minHeight: 52,
    borderRadius: 8,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  inputActive: {
    borderColor: colors.borderGold,
    backgroundColor: colors.card,
  },
  inputInline: {
    flex: 1,
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 15,
    paddingVertical: 0,
  },
  placeholder: {
    color: colors.textDim,
  },
  inputIcon: {
    fontSize: 21,
  },
  iconButton: {
    minWidth: 38,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  notes: {
    minHeight: 90,
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  notesText: {
    lineHeight: 21,
  },
  submit: {
    marginTop: 18,
  },
  pickerList: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardDeep,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 10,
    marginTop: 8,
  },
  pickerItem: {
    width: '48%',
    minHeight: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pickerItemActive: {
    borderColor: colors.borderGold,
    backgroundColor: `${colors.gold}22`,
  },
  pickerText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '800',
  },
  pickerTextActive: {
    color: colors.gold,
  },
});
