import React, {useEffect} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, topInset, typography} from '../../constants/theme';
import {images} from '../../data/assets';

type Props = {
  onFinish: () => void;
};

export function SplashScreen({onFinish}: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(onFinish, 5000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <ImageBackground source={images.background} style={styles.root} resizeMode="cover">
      <View style={styles.overlay} />
      <View style={[styles.content, {paddingTop: topInset(insets.top)}]}>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.kicker}>NIAGARA CASINO</Text>
        <Text style={styles.title}>{'Hub Niagara Casino\nQuest'}</Text>
        <Text style={styles.body}>Preparing your guest access...</Text>
        <View style={styles.track}>
          <View style={styles.bar} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayDeep,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logo: {
    width: 154,
    height: 154,
    marginBottom: 26,
  },
  kicker: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    textAlign: 'center',
  },
  body: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 15,
    marginTop: 18,
  },
  track: {
    width: 150,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#263125',
    marginTop: 18,
    overflow: 'hidden',
  },
  bar: {
    width: '72%',
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
});
