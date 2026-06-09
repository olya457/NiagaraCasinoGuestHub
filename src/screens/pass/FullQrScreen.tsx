import React, {useCallback, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {PrimaryButton} from '../../components/PrimaryButton';
import {QrMatrix} from '../../components/QrMatrix';
import {colors, typography} from '../../constants/theme';
import {images} from '../../data/assets';
import {useResponsive} from '../../hooks/useResponsive';
import type {RootStackParamList} from '../../navigation/types';
import {guestStorage} from '../../storage/guestStorage';
import type {GuestProfile} from '../../types';
import {getDateTitle, getTodayKey} from '../../utils/date';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function FullQrScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();
  const responsive = useResponsive();
  const [passId, setPassId] = useState('NCGH');
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const todayKey = getTodayKey();
  const todayTitle = getDateTitle(todayKey);
  const guestName = profile?.name.trim() || 'Guest Visitor';
  const guestRoom = profile?.room.trim() || 'Room not set';
  const passPayload = [
    'Niagara Casino Guest Hub',
    passId,
    guestName,
    guestRoom,
    todayKey,
  ].join('|');

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      Promise.all([
        guestStorage.getPassId(),
        guestStorage.getGuestProfile(),
      ]).then(([storedPassId, storedProfile]) => {
        if (mounted) {
          setPassId(storedPassId);
          setProfile(storedProfile);
        }
      });
      return () => {
        mounted = false;
      };
    }, []),
  );

  return (
    <AppScreen contentStyle={styles.content}>
      <View style={styles.top}>
        <Image
          source={images.logo}
          style={[styles.logo, responsive.isSmallHeight && styles.logoSmall]}
          resizeMode="contain"
        />
        <Text style={styles.title}>QR Guest Pass</Text>
        <Text style={styles.subtitle}>
          {guestName} · {guestRoom}
        </Text>
      </View>
      <View style={styles.qrPanel}>
        <QrMatrix size={responsive.fullQrSize} payload={passPayload} />
      </View>
      <View style={styles.passPill}>
        <Text style={styles.passText}>
          {passId} · {todayTitle}
        </Text>
      </View>
      <PrimaryButton
        title="Close"
        onPress={() => navigation.goBack()}
        variant="ghost"
        style={styles.close}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    alignItems: 'center',
    marginBottom: 26,
  },
  logo: {
    width: 82,
    height: 82,
    marginBottom: 10,
  },
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 15,
    marginTop: 8,
  },
  qrPanel: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderGold,
    backgroundColor: colors.cardAlt,
    padding: 24,
  },
  passPill: {
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 20,
  },
  passText: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  close: {
    alignSelf: 'stretch',
    marginTop: 28,
  },
  logoSmall: {
    width: 66,
    height: 66,
  },
});
