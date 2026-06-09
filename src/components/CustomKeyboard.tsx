import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, typography} from '../constants/theme';
import {useResponsive} from '../hooks/useResponsive';

type Props = {
  onKey: (value: string) => void;
  layout?: 'text' | 'profile' | 'number';
};

const textRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'delete'],
  ['.', ',', '-', '?', 'space', 'clear', 'done'],
];

const profileRows = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'delete'],
  ['.', ',', '-', '/', '#', '&', 'space', 'clear', 'done'],
];

const numberRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['/', '0', 'delete'],
  ['clear', 'done'],
];

const rowsByLayout = {
  text: textRows,
  profile: profileRows,
  number: numberRows,
};

export function CustomKeyboard({
  onKey,
  layout = 'text',
}: Props): React.JSX.Element {
  const responsive = useResponsive();
  const rows = rowsByLayout[layout];

  return (
    <View style={[styles.panel, responsive.isSmallHeight && styles.panelSmall]}>
      {rows.map((row, rowIndex) => (
        <View key={`text-${rowIndex}`} style={styles.row}>
          {row.map(key => {
            const control =
              key === 'delete' ||
              key === 'clear' ||
              key === 'done' ||
              key === 'space';
            return (
              <Pressable
                key={key}
                onPress={() => onKey(key)}
                style={({pressed}) => [
                  styles.key,
                  control && styles.controlKey,
                  key === 'done' && styles.doneKey,
                  key === 'space' && styles.spaceKey,
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.keyText,
                    control && styles.controlText,
                    key === 'done' && styles.doneText,
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
                  {labelForKey(key)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const labelForKey = (key: string) => {
  if (key === 'delete') {
    return 'Del';
  }
  if (key === 'clear') {
    return 'Clear';
  }
  if (key === 'done') {
    return 'Done';
  }
  if (key === 'space') {
    return 'Space';
  }
  return key;
};

const styles = StyleSheet.create({
  panel: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardDeep,
    padding: 8,
    gap: 5,
    marginTop: 12,
  },
  panelSmall: {
    padding: 7,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  key: {
    flex: 1,
    minWidth: 0,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  controlKey: {
    backgroundColor: colors.card,
  },
  doneKey: {
    borderColor: colors.borderGold,
    backgroundColor: `${colors.gold}22`,
  },
  spaceKey: {
    flex: 2.3,
  },
  pressed: {
    opacity: 0.72,
    transform: [{scale: 0.98}],
  },
  keyText: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '800',
  },
  controlText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  doneText: {
    color: colors.gold,
  },
});
