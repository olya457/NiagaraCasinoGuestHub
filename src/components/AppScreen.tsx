import React from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  bottomInset,
  colors,
  tabBottomGap,
  topInset,
} from '../constants/theme';
import {useResponsive} from '../hooks/useResponsive';

type Props = {
  children: React.ReactNode;
  withTabs?: boolean;
  scroll?: boolean;
  compactTop?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  bottomExtra?: number;
};

export function AppScreen({
  children,
  withTabs,
  scroll = true,
  compactTop,
  style,
  contentStyle,
  bottomExtra = 0,
}: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const responsive = useResponsive();
  const topGap = responsive.isTinyHeight ? 6 : compactTop ? 8 : 18;
  const paddingTop = topInset(insets.top) + topGap;
  const paddingBottom = withTabs
    ? responsive.tabHeight + tabBottomGap() + (responsive.isTinyHeight ? 86 : responsive.isSmallHeight ? 72 : 40)
    : bottomInset(insets.bottom) + (responsive.isTinyHeight ? 58 : responsive.isSmallHeight ? 48 : 24) + bottomExtra;

  if (!scroll) {
    return (
      <View style={[styles.root, style]}>
        <View
          style={[
            styles.content,
            {
              paddingTop,
              paddingBottom,
              paddingHorizontal: responsive.horizontalPadding,
            },
            contentStyle,
          ]}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.root, style]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop,
          paddingBottom,
          paddingHorizontal: responsive.horizontalPadding,
        },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
  },
});
