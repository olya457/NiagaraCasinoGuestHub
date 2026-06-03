import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {Badge} from '../../components/Badge';
import {InfoCard} from '../../components/InfoCard';
import {PrimaryButton} from '../../components/PrimaryButton';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import {nearbyPlaces} from '../../data/nearbyPlaces';
import {useResponsive} from '../../hooks/useResponsive';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'NearbyPlaces'>;

export function NearbyPlacesScreen({navigation}: Props): React.JSX.Element {
  const responsive = useResponsive();

  return (
    <AppScreen compactTop>
      <ScreenHeader
        title="Nearby Places"
        subtitle="Discover places to visit before or after your venue experience."
        back
        onBack={() => navigation.goBack()}
      />
      <View style={styles.list}>
        {nearbyPlaces.map(place => (
          <InfoCard key={place.id} style={styles.card}>
            <Image
              source={place.image}
              style={[styles.image, {height: responsive.listImageHeight}]}
              resizeMode="cover"
            />
            <View style={styles.body}>
              <Badge label={place.tag} tone={colors.mint} />
              <Text style={styles.title}>{place.title}</Text>
              <Text style={styles.description} numberOfLines={3}>
                {place.description}
              </Text>
              <PrimaryButton
                title="View Details"
                variant="outline"
                onPress={() =>
                  navigation.navigate('NearbyPlaceDetail', {placeId: place.id})
                }
                style={styles.button}
              />
            </View>
          </InfoCard>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
  card: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 142,
  },
  body: {
    padding: 14,
  },
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 10,
  },
  description: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  button: {
    alignSelf: 'flex-start',
    minHeight: 38,
    marginTop: 12,
  },
});
