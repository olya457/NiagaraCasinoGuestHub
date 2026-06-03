import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {PrimaryButton} from '../../components/PrimaryButton';
import {QrMatrix} from '../../components/QrMatrix';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import {useResponsive} from '../../hooks/useResponsive';
import type {RootStackParamList} from '../../navigation/types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const notes = [
  'Keep the screen brightness high.',
  'Use this pass only for guest access features.',
  'Ask staff if your pass cannot be scanned.',
];

export function PassScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();
  const responsive = useResponsive();

  return (
    <AppScreen withTabs>
      <ScreenHeader
        title="QR Guest Pass"
        subtitle="Your digital guest access card for venue features and assistance."
      />
      <Pressable
        onPress={() => navigation.navigate('FullQr')}
        style={[
          styles.card,
          responsive.isSmallHeight && styles.cardSmall,
          responsive.isNarrow && styles.cardNarrow,
        ]}>
        <View style={styles.cardTop}>
          <View>
            <Text style={[styles.kicker, responsive.isSmallHeight && styles.kickerSmall]}>
              GUEST ACCESS
            </Text>
            <Text
              style={[
                styles.cardName,
                responsive.isSmallHeight && styles.cardNameSmall,
              ]}>
              Hub Niagara Casino Quest
            </Text>
          </View>
          <View style={[styles.statusPill, responsive.isNarrow && styles.statusPillNarrow]}>
            <Text style={[styles.statusText, responsive.isNarrow && styles.statusTextNarrow]}>
              Valid Today
            </Text>
          </View>
        </View>
        <View style={[styles.qrWrap, responsive.isSmallHeight && styles.qrWrapSmall]}>
          <QrMatrix size={responsive.qrSize} />
        </View>
        <View style={styles.cardBottom}>
          <View>
            <Text style={styles.metaLabel}>PASS ID</Text>
            <Text style={[styles.passId, responsive.isNarrow && styles.passIdNarrow]}>
              NCGH-2048
            </Text>
          </View>
          <View>
            <Text style={[styles.metaLabel, styles.rightText]}>STATUS</Text>
            <Text style={styles.valid}>Valid Today</Text>
          </View>
        </View>
        <Text style={[styles.tap, responsive.isSmallHeight && styles.tapSmall]}>
          Tap to Brighten
        </Text>
      </Pressable>
      <PrimaryButton
        title="Show Full Screen QR"
        onPress={() => navigation.navigate('FullQr')}
        style={[styles.button, responsive.isSmallHeight && styles.buttonSmall]}
      />
      <Text style={[styles.sectionTitle, responsive.isSmallHeight && styles.sectionTitleSmall]}>
        Pass Notes
      </Text>
      <View style={styles.notes}>
        {notes.map(note => (
          <View
            key={note}
            style={[styles.noteRow, responsive.isSmallHeight && styles.noteRowSmall]}>
            <Text style={styles.bullet}>•</Text>
            <Text style={[styles.note, responsive.isSmallHeight && styles.noteSmall]}>
              {note}
            </Text>
          </View>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderGold,
    backgroundColor: colors.cardAlt,
    padding: 24,
    overflow: 'hidden',
  },
  cardNarrow: {
    padding: 18,
  },
  cardSmall: {
    padding: 18,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
  },
  kicker: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  kickerSmall: {
    fontSize: 10,
    letterSpacing: 1.4,
  },
  cardName: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 15,
    marginTop: 7,
  },
  cardNameSmall: {
    fontSize: 14,
    marginTop: 5,
  },
  statusPill: {
    borderRadius: 12,
    backgroundColor: 'rgba(33, 201, 137, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusPillNarrow: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: colors.mint,
    fontFamily: typography.body,
    fontSize: 11,
    fontWeight: '800',
  },
  statusTextNarrow: {
    fontSize: 10,
  },
  qrWrap: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 26,
  },
  qrWrapSmall: {
    marginTop: 16,
    marginBottom: 18,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  metaLabel: {
    color: colors.textDim,
    fontFamily: typography.body,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  rightText: {
    textAlign: 'right',
  },
  passId: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 6,
  },
  passIdNarrow: {
    fontSize: 14,
    letterSpacing: 1.4,
  },
  valid: {
    color: colors.mint,
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 6,
  },
  tap: {
    color: colors.textDim,
    fontFamily: typography.body,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
  },
  tapSmall: {
    marginTop: 14,
    fontSize: 11,
  },
  button: {
    marginTop: 18,
  },
  buttonSmall: {
    marginTop: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitleSmall: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
  },
  notes: {
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 15,
  },
  noteRowSmall: {
    paddingVertical: 11,
  },
  bullet: {
    color: colors.gold,
    fontSize: 22,
    lineHeight: 22,
  },
  note: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  noteSmall: {
    fontSize: 13,
    lineHeight: 19,
  },
});
