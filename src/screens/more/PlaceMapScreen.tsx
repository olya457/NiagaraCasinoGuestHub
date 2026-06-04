import React from 'react';
import {Linking, Platform, StyleSheet, Text, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {InfoCard} from '../../components/InfoCard';
import {PrimaryButton} from '../../components/PrimaryButton';
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
  const coordinates = `${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}`;

  const openExternalMap = async () => {
    const label = encodeURIComponent(place.title);
    const geoUrl = `geo:${place.latitude},${place.longitude}?q=${place.latitude},${place.longitude}(${label})`;
    const webUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    const canOpenGeo = await Linking.canOpenURL(geoUrl);
    await Linking.openURL(canOpenGeo ? geoUrl : webUrl);
  };

  return (
    <AppScreen compactTop contentStyle={styles.content}>
      <ScreenHeader title={place.title} back onBack={() => navigation.goBack()} />
      {Platform.OS === 'android' ? (
        <InfoCard
          style={[
            styles.androidMapCard,
            responsive.isSmallHeight && styles.androidMapCardSmall,
          ]}>
          <View style={styles.pinCircle}>
            <Text style={styles.pin}>📍</Text>
          </View>
          <Text style={styles.androidTitle}>{place.title}</Text>
          <Text style={styles.androidBody}>
            Open this location in your device map app.
          </Text>
          <PrimaryButton
            title="Open Google Maps"
            onPress={openExternalMap}
            style={styles.mapButton}
          />
        </InfoCard>
      ) : (
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
      )}
      <View style={styles.coords}>
        <Text style={styles.coordLabel}>Coordinates</Text>
        <Text style={styles.coordText}>{coordinates}</Text>
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
  androidMapCard: {
    minHeight: 300,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  androidMapCardSmall: {
    minHeight: 240,
    padding: 18,
  },
  pinCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  pin: {
    fontSize: 32,
  },
  androidTitle: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  androidBody: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
  },
  mapButton: {
    alignSelf: 'stretch',
    marginTop: 22,
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
