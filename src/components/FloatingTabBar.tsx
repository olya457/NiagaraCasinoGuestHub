import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, tabBottomGap, typography} from '../constants/theme';
import {useResponsive} from '../hooks/useResponsive';

export type MainTabKey = 'pass' | 'halls' | 'services' | 'events' | 'more';

type Props = {
  active: MainTabKey;
  onChange: (tab: MainTabKey) => void;
};

const tabs: {key: MainTabKey; label: string; icon: string}[] = [
  {key: 'pass', label: 'Pass', icon: '🎫'},
  {key: 'halls', label: 'Halls', icon: '🏛️'},
  {key: 'services', label: 'Services', icon: '📋'},
  {key: 'events', label: 'Events', icon: '🗓️'},
  {key: 'more', label: 'More', icon: '•••'},
];

export function FloatingTabBar({
  active,
  onChange,
}: Props): React.JSX.Element {
  const responsive = useResponsive();

  return (
    <View
      style={[
        styles.panel,
        {
          bottom: tabBottomGap(),
          height: responsive.tabHeight,
        },
        responsive.isTinyHeight && styles.panelTiny,
        responsive.isNarrow ? styles.panelNarrow : styles.panelWide,
      ]}>
      {tabs.map(tab => {
        const selected = active === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={({pressed}) => [styles.item, pressed && styles.pressed]}>
            <View
              style={[
                styles.iconWrap,
                responsive.isTinyHeight && styles.iconWrapTiny,
                selected && styles.iconActive,
              ]}>
              <Text
                style={[
                  styles.icon,
                  responsive.isTinyHeight && styles.iconTiny,
                  selected && styles.iconSelected,
                ]}>
                {tab.icon}
              </Text>
            </View>
            <Text
              style={[
                styles.label,
                responsive.isTinyHeight && styles.labelTiny,
                selected && styles.labelActive,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(5, 19, 12, 0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: colors.black,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 10},
    elevation: 9,
  },
  panelTiny: {
    borderRadius: 18,
    paddingHorizontal: 6,
  },
  panelWide: {
    left: 16,
    right: 16,
  },
  panelNarrow: {
    left: 10,
    right: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  pressed: {
    opacity: 0.7,
  },
  iconWrap: {
    minWidth: 32,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
  },
  iconWrapTiny: {
    minWidth: 28,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 5,
  },
  iconActive: {
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  icon: {
    color: colors.textDim,
    fontSize: 16,
    fontWeight: '900',
  },
  iconTiny: {
    fontSize: 14,
  },
  iconSelected: {
    color: colors.gold,
  },
  label: {
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 10,
    marginTop: 3,
    fontWeight: '700',
  },
  labelTiny: {
    fontSize: 9,
    marginTop: 2,
  },
  labelActive: {
    color: colors.gold,
  },
});
