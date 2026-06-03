import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {Badge} from '../../components/Badge';
import {InfoCard} from '../../components/InfoCard';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import {venueHalls} from '../../data/venueHalls';
import {useResponsive} from '../../hooks/useResponsive';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HallDetail'>;

export function HallDetailScreen({
  route,
  navigation,
}: Props): React.JSX.Element {
  const hall = venueHalls.find(item => item.id === route.params.hallId) ?? venueHalls[0];
  const responsive = useResponsive();

  return (
    <AppScreen compactTop>
      <ScreenHeader title={hall.title} back onBack={() => navigation.goBack()} />
      <Image
        source={hall.image}
        style={[styles.hero, {height: responsive.heroHeight}]}
        resizeMode="cover"
      />
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{hall.title}</Text>
          <Text style={styles.description}>{hall.description}</Text>
        </View>
        <Badge label={hall.tag} tone={toneForTag(hall.tag)} />
      </View>
      <InfoCard style={styles.highlights}>
        <Text style={styles.cardTitle}>Highlights</Text>
        {hall.highlights.map(item => (
          <View key={item} style={styles.highlightRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.highlightText}>{item}</Text>
          </View>
        ))}
      </InfoCard>
      <View style={styles.metaGrid}>
        <InfoCard style={styles.metaCard}>
          <Text style={styles.metaLabel}>HOURS</Text>
          <Text style={styles.metaText}>{hall.hours}</Text>
        </InfoCard>
        <InfoCard style={styles.metaCard}>
          <Text style={styles.metaLabel}>LOCATION</Text>
          <Text style={styles.metaText}>{hall.location}</Text>
        </InfoCard>
      </View>
    </AppScreen>
  );
}

const toneForTag = (tag: string) => {
  if (tag.includes('Dining') || tag.includes('Restaurant') || tag.includes('Cafe')) {
    return colors.amber;
  }
  if (tag.includes('Lounge') || tag.includes('Nightlife')) {
    return colors.blue;
  }
  if (tag.includes('Events') || tag.includes('Entertainment')) {
    return colors.violet;
  }
  if (tag.includes('Casino')) {
    return '#d14f3f';
  }
  return colors.mint;
};

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 190,
    borderRadius: 18,
    marginBottom: 18,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 27,
    fontWeight: '800',
    lineHeight: 34,
  },
  description: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
  },
  highlights: {
    padding: 18,
    marginTop: 20,
  },
  cardTitle: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 10,
  },
  bullet: {
    color: colors.gold,
    fontSize: 18,
    lineHeight: 20,
  },
  highlightText: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  metaCard: {
    flex: 1,
    padding: 14,
    minHeight: 112,
  },
  metaLabel: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  metaText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 19,
  },
});
