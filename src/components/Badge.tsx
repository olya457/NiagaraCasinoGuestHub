import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, typography} from '../constants/theme';

type Props = {
  label: string;
  tone?: string;
};

export function Badge({label, tone = colors.gold}: Props): React.JSX.Element {
  return (
    <View style={[styles.badge, {backgroundColor: `${tone}22`}]}>
      <Text style={[styles.text, {color: tone}]} numberOfLines={1}>
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
});
