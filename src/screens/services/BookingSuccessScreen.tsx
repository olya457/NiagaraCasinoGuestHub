import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppScreen} from '../../components/AppScreen';
import {PrimaryButton} from '../../components/PrimaryButton';
import {colors, typography} from '../../constants/theme';
import type {RootStackParamList} from '../../navigation/types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function BookingSuccessScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();

  return (
    <AppScreen contentStyle={styles.content}>
      <View style={styles.check}>
        <Text style={styles.checkText}>✓</Text>
      </View>
      <Text style={styles.title}>Booking request sent</Text>
      <Text style={styles.body}>
        Your request has been prepared. A venue assistant may confirm the details.
      </Text>
      <PrimaryButton
        title="Back to Services"
        onPress={() => navigation.navigate('MainTabs', {initialTab: 'services'})}
        style={styles.button}
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
  check: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  checkText: {
    color: colors.mint,
    fontSize: 42,
    fontWeight: '300',
  },
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 310,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: 34,
  },
});
