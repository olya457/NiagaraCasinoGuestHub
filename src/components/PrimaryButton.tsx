import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import {colors, typography} from '../constants/theme';
import {useResponsive} from '../hooks/useResponsive';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outline' | 'ghost';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function PrimaryButton({
  title,
  onPress,
  variant = 'filled',
  style,
  disabled,
}: Props): React.JSX.Element {
  const responsive = useResponsive();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({pressed}) => [
        styles.button,
        responsive.isSmallHeight && styles.buttonSmall,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <Text
        style={[
          styles.text,
          variant !== 'filled' && styles.outlineText,
          disabled && styles.disabledText,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.32,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 8},
    elevation: 4,
  },
  buttonSmall: {
    minHeight: 44,
    paddingHorizontal: 14,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderGold,
    shadowOpacity: 0,
    elevation: 0,
  },
  ghost: {
    backgroundColor: colors.cardAlt,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    color: colors.black,
    fontFamily: typography.body,
    fontWeight: '800',
    fontSize: 15,
  },
  outlineText: {
    color: colors.gold,
  },
  pressed: {
    opacity: 0.78,
    transform: [{scale: 0.99}],
  },
  disabled: {
    opacity: 0.56,
  },
  disabledText: {
    color: colors.textDim,
  },
});
