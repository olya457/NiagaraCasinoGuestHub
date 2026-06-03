import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import {nearbyPlaces} from '../../data/nearbyPlaces';
import type {RootStackParamList} from '../../navigation/types';
import {AppScreen} from '../../components/AppScreen';
import {useResponsive} from '../../hooks/useResponsive';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceMap'>;

export function PlaceMapScreen({route, navigation}: Props): React.JSX.Element {
  const place = nearbyPlaces.find(item => item.id === route.params.placeId) ?? nearbyPlaces[0];
  const responsive = useResponsive();

  return (
    <AppScreen compactTop contentStyle={styles.content}>
      <ScreenHeader title={place.title} back onBack={() => navigation.goBack()} />
      <View
        style={[
          styles.mapCard,
          responsive.isTinyHeight
            ? styles.mapTiny
            : responsive.isSmallHeight
              ? styles.mapSmall
              : styles.mapRegular,
        ]}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: place.latitude,
            longitude: place.longitude,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
          }}>
          <Marker
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.title}
            description={place.tag}
          />
        </MapView>
      </View>
      <View style={styles.coords}>
        <Text style={styles.coordLabel}>Coordinates</Text>
        <Text style={styles.coordText}>
          {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
        </Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  mapCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  mapTiny: {
    height: 280,
  },
  mapSmall: {
    height: 340,
  },
  mapRegular: {
    height: 420,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  coords: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 14,
    marginTop: 14,
  },
  coordLabel: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  coordText: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 6,
  },
});
