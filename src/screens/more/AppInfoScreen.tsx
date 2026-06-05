import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {InfoCard} from '../../components/InfoCard';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import {images} from '../../data/assets';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AppInfo'>;

const features = [
  'QR Guest Pass',
  'Venue Halls Guide',
  'Book Services',
  'Upcoming Events',
  'Q&A Help',
  'Nearby Places',
];

export function AppInfoScreen({navigation}: Props): React.JSX.Element {
  return (
    <AppScreen compactTop>
      <ScreenHeader title="App Info" back onBack={() => navigation.goBack()} />
      <View style={styles.hero}>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Niagara Guest Hub</Text>
        <Text style={styles.version}>Version 1.0 · Guest Guide</Text>
      </View>
      <InfoCard style={styles.about}>
        <Text style={styles.aboutText}>
          Niagara Guest Hub is a guest information and planning app for venue access, halls, services, events, Q&A support, and nearby visit ideas.
        </Text>
      </InfoCard>
      <InfoCard style={styles.features}>
        <Text style={styles.featureTitle}>Features</Text>
        {features.map(feature => (
          <View key={feature} style={styles.featureRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </InfoCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  version: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    marginTop: 6,
  },
  about: {
    padding: 16,
    marginBottom: 14,
  },
  aboutText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 22,
  },
  features: {
    padding: 16,
  },
  featureTitle: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 10,
  },
  bullet: {
    color: colors.gold,
    fontSize: 18,
    lineHeight: 19,
  },
  featureText: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
  },
});
