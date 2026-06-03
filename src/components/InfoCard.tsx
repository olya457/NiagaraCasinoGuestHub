import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {colors, layout} from '../constants/theme';

export function InfoCard({
  children,
  style,
}: ViewProps): React.JSX.Element {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: layout.radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
});
