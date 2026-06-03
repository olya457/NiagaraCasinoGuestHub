import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {Badge} from '../../components/Badge';
import {InfoCard} from '../../components/InfoCard';
import {ScreenHeader} from '../../components/ScreenHeader';
import {colors, typography} from '../../constants/theme';
import {faqs} from '../../data/faqs';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Faq'>;

export function FaqScreen({navigation}: Props): React.JSX.Element {
  const [openId, setOpenId] = useState(faqs[0]?.id);

  return (
    <AppScreen compactTop>
      <ScreenHeader
        title="Q&A Help"
        subtitle="Quick answers for common guest questions."
        back
        onBack={() => navigation.goBack()}
      />
      <View style={styles.list}>
        {faqs.map(item => {
          const open = openId === item.id;
          return (
            <InfoCard key={item.id} style={styles.card}>
              <Pressable
                onPress={() => setOpenId(open ? '' : item.id)}
                style={styles.questionRow}>
                <View style={styles.questionBlock}>
                  <Badge label={item.category} tone={colors.gold} />
                  <Text style={styles.question}>{item.question}</Text>
                </View>
                <Text style={styles.chevron}>{open ? '⌃' : '⌄'}</Text>
              </Pressable>
              {open ? <Text style={styles.answer}>{item.answer}</Text> : null}
            </InfoCard>
          );
        })}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  card: {
    padding: 12,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  questionBlock: {
    flex: 1,
    minWidth: 0,
  },
  question: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
    marginTop: 8,
  },
  chevron: {
    color: colors.gold,
    fontSize: 18,
  },
  answer: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
});
