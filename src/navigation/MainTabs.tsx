import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  FloatingTabBar,
  type MainTabKey,
} from '../components/FloatingTabBar';
import {colors} from '../constants/theme';
import {EventsScreen} from '../screens/events/EventsScreen';
import {HallsScreen} from '../screens/halls/HallsScreen';
import {MoreScreen} from '../screens/more/MoreScreen';
import {PassScreen} from '../screens/pass/PassScreen';
import {ServicesScreen} from '../screens/services/ServicesScreen';
import type {RootStackParamList} from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

export function MainTabs({route}: Props): React.JSX.Element {
  const [active, setActive] = useState<MainTabKey>(
    route.params?.initialTab ?? 'pass',
  );

  useEffect(() => {
    if (route.params?.initialTab) {
      setActive(route.params.initialTab);
    }
  }, [route.params?.initialTab]);

  return (
    <View style={styles.root}>
      <View style={styles.content}>{renderTab(active)}</View>
      <FloatingTabBar active={active} onChange={setActive} />
    </View>
  );
}

function renderTab(active: MainTabKey): React.JSX.Element {
  if (active === 'halls') {
    return <HallsScreen />;
  }
  if (active === 'services') {
    return <ServicesScreen />;
  }
  if (active === 'events') {
    return <EventsScreen />;
  }
  if (active === 'more') {
    return <MoreScreen />;
  }
  return <PassScreen />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
