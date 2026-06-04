import React from 'react';
import {Image, StyleSheet, Text} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {Badge} from '../../components/Badge';
import {InfoCard} from '../../components/InfoCard';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import {nearbyPlaces} from '../../data/nearbyPlaces';
import {useResponsive} from '../../hooks/useResponsive';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'NearbyPlaceDetail'>;

export function NearbyPlaceDetailScreen({
  route,
  navigation,
}: Props): React.JSX.Element {
  const place =
    nearbyPlaces.find(item => item.id === route.params.placeId) ?? nearbyPlaces[0];
  const responsive = useResponsive();

  return (
    <AppScreen compactTop>
      <ScreenHeader title="" back onBack={() => navigation.goBack()} />
      <Image
        source={place.image}
        style={[styles.hero, {height: responsive.heroHeight}]}
        resizeMode="cover"
      />
      <Badge label={place.tag} tone={colors.mint} />
      <Text style={styles.title}>{place.title}</Text>
      <Text style={styles.description}>{place.description}</Text>
      <InfoCard style={styles.info}>
        <Text style={styles.infoLabel}>BEST TIME TO VISIT</Text>
        <Text style={styles.infoText}>{place.bestTime}</Text>
      </InfoCard>
      <InfoCard style={styles.info}>
        <Text style={styles.infoLabel}>VISITOR TIP</Text>
        <Text style={styles.infoText}>{place.tip}</Text>
      </InfoCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 190,
    borderRadius: 18,
    marginBottom: 16,
  },
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: 12,
  },
  description: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },
  info: {
    padding: 14,
    marginTop: 14,
  },
  infoLabel: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  infoText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
});
