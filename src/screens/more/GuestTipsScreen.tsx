import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {InfoCard} from '../../components/InfoCard';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import {guestTips} from '../../data/tips';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'GuestTips'>;

export function GuestTipsScreen({navigation}: Props): React.JSX.Element {
  return (
    <AppScreen compactTop>
      <ScreenHeader title="Guest Tips" back onBack={() => navigation.goBack()} />
      <View style={styles.list}>
        {guestTips.map((tip, index) => (
          <InfoCard key={tip} style={styles.card}>
            <View style={styles.number}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
            <Text style={styles.tip}>{tip}</Text>
          </InfoCard>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  card: {
    minHeight: 58,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  number: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.gold}22`,
  },
  numberText: {
    color: colors.gold,
    fontFamily: typography.body,
    fontWeight: '900',
  },
  tip: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
});
