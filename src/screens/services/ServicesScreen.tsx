import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {Badge} from '../../components/Badge';
import {InfoCard} from '../../components/InfoCard';
import {PrimaryButton} from '../../components/PrimaryButton';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import {services} from '../../data/services';
import {useResponsive} from '../../hooks/useResponsive';
import type {RootStackParamList} from '../../navigation/types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function ServicesScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();
  const responsive = useResponsive();

  return (
    <AppScreen withTabs>
      <ScreenHeader
        title="Book Services"
        subtitle="Choose a service and prepare your visit in advance."
      />
      <View style={styles.list}>
        {services.map(service => (
          <InfoCard
            key={service.id}
            style={[styles.card, responsive.isNarrow && styles.cardNarrow]}>
            <View
              style={[
                styles.iconBox,
                responsive.isNarrow && styles.iconBoxNarrow,
                {borderColor: `${service.accent}66`},
              ]}>
              <Text style={styles.icon}>{service.icon}</Text>
            </View>
            <View style={styles.content}>
              <View style={styles.topRow}>
                <Badge label={service.tag} tone={service.accent} />
                <Text style={styles.time} numberOfLines={1}>
                  {service.time}
                </Text>
              </View>
              <Text style={styles.title}>{service.title}</Text>
              <Text style={styles.description}>{service.description}</Text>
              <PrimaryButton
                title="Book Now"
                onPress={() => navigation.navigate('Booking', {serviceId: service.id})}
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },
  cardNarrow: {
    padding: 12,
    gap: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxNarrow: {
    width: 40,
    height: 40,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  time: {
    flexShrink: 1,
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
    marginTop: 8,
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
    minWidth: 112,
    minHeight: 42,
    marginTop: 14,
  },
});
