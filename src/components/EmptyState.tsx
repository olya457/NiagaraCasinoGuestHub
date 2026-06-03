import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, typography} from '../constants/theme';
import {useResponsive} from '../hooks/useResponsive';
import {PrimaryButton} from './PrimaryButton';

type Props = {
  icon: string;
  title: string;
  body: string;
  actionTitle?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon,
  title,
  body,
  actionTitle,
  onAction,
}: Props): React.JSX.Element {
  const responsive = useResponsive();

  return (
    <View style={[styles.wrap, responsive.isSmallHeight && styles.wrapSmall]}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {actionTitle && onAction ? (
        <PrimaryButton title={actionTitle} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 56,
  },
  wrapSmall: {
    paddingVertical: 34,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    marginTop: 8,
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  action: {
    marginTop: 22,
    minWidth: 154,
  },
});
