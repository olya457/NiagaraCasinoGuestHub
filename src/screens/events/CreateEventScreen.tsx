import React, {useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {CustomKeyboard} from '../../components/CustomKeyboard';
import {InfoCard} from '../../components/InfoCard';
import {PrimaryButton} from '../../components/PrimaryButton';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import type {RootStackParamList} from '../../navigation/types';
import {guestStorage} from '../../storage/guestStorage';
import {getDateTitle, getLongDayName} from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateEvent'>;
type TextField = 'title' | 'room' | 'details';
type PickerName = 'time' | 'type';

const timeOptions = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
  'By request',
];

const eventTypes = [
  'Music Evening',
  'Dining Event',
  'Guided Experience',
  'Guest Info',
  'Decor Preview',
  'Custom Plan',
];

const typeMeta: Record<string, {icon: string; accent: string}> = {
  'Music Evening': {icon: '🎵', accent: colors.cyan},
  'Dining Event': {icon: '🍽️', accent: colors.amber},
  'Guided Experience': {icon: '🚶', accent: colors.mint},
  'Guest Info': {icon: 'ℹ️', accent: colors.blue},
  'Decor Preview': {icon: '✨', accent: colors.rose},
  'Custom Plan': {icon: '📅', accent: colors.gold},
};

export function CreateEventScreen({route, navigation}: Props): React.JSX.Element {
  const dateKey = route.params.dateKey;
  const [title, setTitle] = useState('');
  const [room, setRoom] = useState('');
  const [details, setDetails] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Custom Plan');
  const [activeField, setActiveField] = useState<TextField | null>(null);
  const [openPicker, setOpenPicker] = useState<PickerName | null>(null);
  const [saving, setSaving] = useState(false);
  const canSave = useMemo(
    () => title.trim().length > 0 && room.trim().length > 0 && time.trim().length > 0,
    [room, time, title],
  );

  const setFieldValue = (field: TextField, value: string) => {
    if (field === 'title') {
      setTitle(value);
    } else if (field === 'room') {
      setRoom(value);
    } else {
      setDetails(value);
    }
  };

  const getFieldValue = (field: TextField) => {
    if (field === 'title') {
      return title;
    }
    if (field === 'room') {
      return room;
    }
    return details;
  };

  const openTextField = (field: TextField) => {
    setOpenPicker(null);
    setActiveField(field);
  };

  const togglePicker = (picker: PickerName) => {
    setActiveField(null);
    setOpenPicker(current => (current === picker ? null : picker));
  };

  const handleKey = (key: string) => {
    if (!activeField) {
      return;
    }

    if (key === 'done') {
      setActiveField(null);
      return;
    }

    if (key === 'clear') {
      setFieldValue(activeField, '');
      return;
    }

    const current = getFieldValue(activeField);

    if (key === 'delete') {
      setFieldValue(activeField, current.slice(0, -1));
      return;
    }

    const rawValue = key === 'space' ? ' ' : key;
    const nextChar =
      rawValue.length === 1 && /[A-Z]/.test(rawValue)
        ? current.length === 0 || /[\s.-]/.test(current[current.length - 1])
          ? rawValue
          : rawValue.toLowerCase()
        : rawValue;
    const limit = activeField === 'details' ? 220 : 52;
    setFieldValue(activeField, `${current}${nextChar}`.slice(0, limit));
  };

  const save = async () => {
    if (!canSave || saving) {
      return;
    }

    setSaving(true);
    const meta = typeMeta[type] ?? typeMeta['Custom Plan'];
    const cleanDetails = details.trim();
    await guestStorage.addCustomEvent({
      id: `custom-event-${Date.now()}`,
      title: title.trim(),
      room: room.trim(),
      date: getLongDayName(dateKey),
      dateKey,
      time,
      type,
      guests: 'By request',
      dress: 'Guest Choice',
      summary: cleanDetails || 'A custom guest event added for this date.',
      description:
        cleanDetails || 'This custom event was added to the guest calendar.',
      icon: meta.icon,
      accent: meta.accent,
      custom: true,
      createdAt: new Date().toISOString(),
    });
    setSaving(false);
    navigation.goBack();
  };

  return (
    <AppScreen compactTop bottomExtra={activeField ? 120 : 40}>
      <ScreenHeader title="Add Event" back onBack={() => navigation.goBack()} />
      <InfoCard style={styles.dateCard}>
        <Text style={styles.dateLabel}>Selected Date</Text>
        <Text style={styles.dateTitle}>{getDateTitle(dateKey)}</Text>
      </InfoCard>
      <DataField
        label="Event Name"
        value={title}
        placeholder="Event name"
        icon="✏️"
        active={activeField === 'title'}
        onPress={() => openTextField('title')}
      />
      <DataField
        label="Room or Place"
        value={room}
        placeholder="Room or venue area"
        icon="🏛️"
        active={activeField === 'room'}
        onPress={() => openTextField('room')}
      />
      <DataField
        label="Time"
        value={time}
        placeholder="Choose time"
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
        label="Type"
        value={type}
        placeholder="Choose type"
        icon="📌"
        active={openPicker === 'type'}
        onPress={() => togglePicker('type')}
      />
      {openPicker === 'type' ? (
        <PickerList
          options={eventTypes}
          value={type}
          onSelect={value => {
            setType(value);
            setOpenPicker(null);
          }}
        />
      ) : null}
      <DataField
        label="Details"
        value={details}
        placeholder="Short description"
        icon="📝"
        active={activeField === 'details'}
        onPress={() => openTextField('details')}
        multiline
      />
      {activeField ? <CustomKeyboard onKey={handleKey} /> : null}
      <PrimaryButton
        title={saving ? 'Saving...' : 'Save Event'}
        onPress={save}
        disabled={!canSave || saving}
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
      <Pressable
        onPress={onPress}
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
        <Text style={styles.inputIcon}>{icon}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  dateCard: {
    padding: 16,
    borderColor: colors.borderGold,
    marginBottom: 8,
  },
  dateLabel: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  dateTitle: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
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
    gap: 10,
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
    lineHeight: 21,
  },
  placeholder: {
    color: colors.textDim,
  },
  inputIcon: {
    fontSize: 20,
  },
  notes: {
    minHeight: 88,
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  notesText: {
    lineHeight: 21,
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
  submit: {
    marginTop: 18,
  },
});
