import React, {useCallback, useState} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {colors} from '../constants/theme';
import {guestStorage} from '../storage/guestStorage';
import {CreateEventScreen} from '../screens/events/CreateEventScreen';
import {EventDetailScreen} from '../screens/events/EventDetailScreen';
import {HallDetailScreen} from '../screens/halls/HallDetailScreen';
import {AppInfoScreen} from '../screens/more/AppInfoScreen';
import {FaqScreen} from '../screens/more/FaqScreen';
import {GuestTipsScreen} from '../screens/more/GuestTipsScreen';
import {MyBookingsScreen} from '../screens/more/MyBookingsScreen';
import {NearbyPlaceDetailScreen} from '../screens/more/NearbyPlaceDetailScreen';
import {NearbyPlacesScreen} from '../screens/more/NearbyPlacesScreen';
import {SavedEventsScreen} from '../screens/more/SavedEventsScreen';
import {OnboardingScreen} from '../screens/onboarding/OnboardingScreen';
import {FullQrScreen} from '../screens/pass/FullQrScreen';
import {BookingScreen} from '../screens/services/BookingScreen';
import {BookingSuccessScreen} from '../screens/services/BookingSuccessScreen';
import {SplashScreen} from '../screens/splash/SplashScreen';
import {MainTabs} from './MainTabs';
import type {RootStackParamList} from './types';

if (process.env.NODE_ENV !== 'test') {
  enableScreens();
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    primary: colors.gold,
  },
};

function AppNavigator(): React.JSX.Element {
  const [phase, setPhase] = useState<'splash' | 'onboarding' | 'app'>('splash');

  const finishSplash = useCallback(async () => {
    const onboardingComplete = await guestStorage.getOnboardingComplete();
    setPhase(onboardingComplete ? 'app' : 'onboarding');
  }, []);

  const finishOnboarding = useCallback(() => {
    setPhase('app');
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      {phase === 'splash' ? <SplashScreen onFinish={finishSplash} /> : null}
      {phase === 'onboarding' ? (
        <OnboardingScreen onDone={finishOnboarding} />
      ) : null}
      {phase === 'app' ? (
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: {backgroundColor: colors.background},
              animation: 'slide_from_right',
            }}>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="FullQr" component={FullQrScreen} />
            <Stack.Screen name="HallDetail" component={HallDetailScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
            <Stack.Screen name="Faq" component={FaqScreen} />
            <Stack.Screen name="NearbyPlaces" component={NearbyPlacesScreen} />
            <Stack.Screen
              name="NearbyPlaceDetail"
              component={NearbyPlaceDetailScreen}
            />
            <Stack.Screen name="SavedEvents" component={SavedEventsScreen} />
            <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
            <Stack.Screen name="GuestTips" component={GuestTipsScreen} />
            <Stack.Screen name="AppInfo" component={AppInfoScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      ) : null}
    </SafeAreaProvider>
  );
}

export default AppNavigator;
