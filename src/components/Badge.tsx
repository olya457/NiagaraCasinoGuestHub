import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, typography} from '../constants/theme';
import {useResponsive} from '../hooks/useResponsive';

type Props = {
  label: string;
  tone?: string;
};

export function Badge({label, tone = colors.gold}: Props): React.JSX.Element {
  const responsive = useResponsive();

  return (
    <View
      style={[
        styles.badge,
        responsive.isNarrow && styles.badgeNarrow,
        {backgroundColor: `${tone}22`},
      ]}>
      <Text
        style={[styles.text, responsive.isNarrow && styles.textNarrow, {color: tone}]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontFamily: typography.body,
    fontSize: 11,
    fontWeight: '700',
  },
  badgeNarrow: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  textNarrow: {
    fontSize: 10,
  },
});
