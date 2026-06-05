import React, {useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {Badge} from '../../components/Badge';
import {PrimaryButton} from '../../components/PrimaryButton';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import {hallFilters, venueHalls} from '../../data/venueHalls';
import {useResponsive} from '../../hooks/useResponsive';
import type {RootStackParamList} from '../../navigation/types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function HallsScreen(): React.JSX.Element {
  const [filter, setFilter] = useState('All');
  const navigation = useNavigation<Navigation>();
  const responsive = useResponsive();

  const halls = useMemo(
    () =>
      filter === 'All'
        ? venueHalls
        : venueHalls.filter(item => item.category === filter),
    [filter],
  );

  return (
    <AppScreen withTabs>
      <ScreenHeader title="Venue Halls" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.filters,
          responsive.isSmallHeight && styles.filtersSmall,
        ]}>
        {hallFilters.map(item => {
          const active = item === filter;
          return (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={[
                styles.filter,
                responsive.isNarrow && styles.filterNarrow,
                active && styles.filterActive,
              ]}>
              <Text
                style={[
                  styles.filterText,
                  responsive.isNarrow && styles.filterTextNarrow,
                  active && styles.filterTextActive,
                ]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={[styles.list, responsive.isSmallHeight && styles.listSmall]}>
        {halls.map(hall => (
          <View key={hall.id} style={styles.card}>
            <Image
              source={hall.image}
              style={[styles.image, {height: responsive.cardImageHeight}]}
              resizeMode="cover"
            />
            <View style={[styles.cardBody, responsive.isSmallHeight && styles.cardBodySmall]}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.cardTitle,
                    responsive.isSmallHeight && styles.cardTitleSmall,
                  ]}
                  numberOfLines={2}>
                  {hall.title}
                </Text>
                <Badge label={hall.tag} tone={toneForTag(hall.tag)} />
              </View>
              <Text
                style={[
                  styles.description,
                  responsive.isSmallHeight && styles.descriptionSmall,
                ]}
                numberOfLines={responsive.isSmallHeight ? 2 : 3}>
                {hall.description}
              </Text>
              <PrimaryButton
                title="View Details"
                variant="outline"
                onPress={() => navigation.navigate('HallDetail', {hallId: hall.id})}
                style={[
                  styles.detailButton,
                  responsive.isSmallHeight && styles.detailButtonSmall,
                ]}
              />
            </View>
          </View>
        ))}
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
  if (tag.includes('Gaming')) {
    return '#d14f3f';
  }
  return colors.mint;
};

const styles = StyleSheet.create({
  filters: {
    gap: 10,
    paddingRight: 16,
    marginBottom: 14,
  },
  filtersSmall: {
    marginBottom: 10,
  },
  filter: {
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  filterNarrow: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  filterText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: '700',
  },
  filterTextNarrow: {
    fontSize: 13,
  },
  filterTextActive: {
    color: colors.black,
  },
  list: {
    gap: 16,
  },
  listSmall: {
    gap: 12,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 136,
  },
  cardBody: {
    padding: 16,
  },
  cardBodySmall: {
    padding: 13,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitle: {
    flex: 1,
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 24,
  },
  cardTitleSmall: {
    fontSize: 17,
    lineHeight: 21,
  },
  description: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  descriptionSmall: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  detailButton: {
    alignSelf: 'flex-start',
    minHeight: 42,
    marginTop: 15,
  },
  detailButtonSmall: {
    minHeight: 38,
    marginTop: 12,
  },
});
