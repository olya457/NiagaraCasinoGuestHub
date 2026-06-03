import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, typography} from '../constants/theme';
import {useResponsive} from '../hooks/useResponsive';

type Props = {
  title: string;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
};

export function ScreenHeader({
  title,
  subtitle,
  back,
  onBack,
}: Props): React.JSX.Element {
  const responsive = useResponsive();

  return (
    <View style={[styles.wrap, responsive.isSmallHeight && styles.wrapSmall]}>
      {back ? (
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
      ) : null}
      {title ? (
        <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
          {title}
        </Text>
      ) : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 18,
  },
  wrapSmall: {
    marginBottom: 12,
  },
  back: {
    alignSelf: 'flex-start',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardDeep,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 14,
  },
  backText: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 6,
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
});
