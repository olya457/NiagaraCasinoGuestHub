import React, {useMemo, useState} from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  bottomInset,
  colors,
  topInset,
  typography,
} from '../../constants/theme';
import {images} from '../../data/assets';
import {guestStorage} from '../../storage/guestStorage';
import {PrimaryButton} from '../../components/PrimaryButton';
import {QrMatrix} from '../../components/QrMatrix';
import {useResponsive} from '../../hooks/useResponsive';

type Props = {
  onDone: () => void;
};

const slides = [
  {
    title: 'Your Guest Access Hub',
    body: 'Keep your guest pass ready and open useful venue tools from one clean mobile guide.',
    kind: 'pass',
  },
  {
    title: 'Explore Halls & Services',
    body: 'View major halls, guest areas, dining zones, lounges, and services that can be requested in advance.',
    kind: 'services',
  },
  {
    title: 'Plan Around the Venue',
    body: 'Check upcoming events, read quick answers, and discover nearby places to visit before or after your stay.',
    kind: 'plan',
  },
] as const;

export function OnboardingScreen({onDone}: Props): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const {height, width} = useWindowDimensions();
  const responsive = useResponsive();
  const slide = slides[index];
  const topHeight = responsive.isTinyHeight
    ? Math.max(250, height * 0.46)
    : responsive.isSmallHeight
      ? Math.max(300, height * 0.52)
      : Math.max(360, height * 0.64);
  const isLast = index === slides.length - 1;
  const visualScale = useMemo(
    () => Math.min(1, Math.max(responsive.isTinyHeight ? 0.72 : 0.82, width / 393)),
    [responsive.isTinyHeight, width],
  );

  const finish = async () => {
    await guestStorage.setOnboardingComplete();
    onDone();
  };

  const next = () => {
    if (isLast) {
      finish();
      return;
    }
    setIndex(value => value + 1);
  };

  return (
    <View style={styles.root}>
      <ImageBackground
        source={images.background}
        style={[styles.hero, {height: topHeight}]}
        resizeMode="cover">
        <View style={styles.heroOverlay} />
        <View style={[styles.visualWrap, {paddingTop: topInset(insets.top) + 18}]}>
          {slide.kind === 'pass' ? <PassVisual scale={visualScale} /> : null}
          {slide.kind === 'services' ? <PreviewVisual source={images.onboardingServices} scale={visualScale} /> : null}
          {slide.kind === 'plan' ? <PreviewVisual source={images.onboardingPlan} scale={visualScale} /> : null}
        </View>
      </ImageBackground>
      <ScrollView
        style={styles.panel}
        contentContainerStyle={[
          styles.panelContent,
          {paddingBottom: bottomInset(insets.bottom) + 18},
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.dots}>
          {slides.map((_, dotIndex) => (
            <View
              key={dotIndex}
              style={[styles.dot, dotIndex === index && styles.dotActive]}
            />
          ))}
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
        <View style={styles.actions}>
          <PrimaryButton
            title={isLast ? 'Get Started' : 'Next'}
            onPress={next}
            style={styles.next}
          />
          {!isLast ? (
            <PrimaryButton
              title="Skip"
              onPress={finish}
              variant="outline"
              style={styles.skip}
            />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

function PassVisual({scale}: {scale: number}): React.JSX.Element {
  return (
    <View style={[styles.passCard, {transform: [{rotate: '-4deg'}, {scale}]}]}>
      <Text style={styles.passKicker}>GUEST ACCESS</Text>
      <Text style={styles.passName}>Hub Niagara Casino Quest</Text>
      <View style={styles.passQr}>
        <QrMatrix size={108} color={colors.gold} />
      </View>
    </View>
  );
}

function PreviewVisual({
  source,
  scale,
}: {
  source: ReturnType<typeof require>;
  scale: number;
}): React.JSX.Element {
  return (
    <Image
      source={source}
      style={[styles.preview, {transform: [{scale}]}]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    width: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 11, 8, 0.22)',
  },
  visualWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  passCard: {
    width: 230,
    minHeight: 190,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderGold,
    backgroundColor: colors.cardAlt,
    padding: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 16},
    elevation: 6,
  },
  passKicker: {
    color: colors.gold,
    fontFamily: typography.body,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  passName: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 13,
    marginTop: 8,
  },
  passQr: {
    alignItems: 'center',
    marginTop: 16,
  },
  preview: {
    width: 352,
    height: 230,
    maxWidth: '100%',
  },
  panel: {
    flex: 1,
    backgroundColor: colors.background,
  },
  panelContent: {
    paddingHorizontal: 24,
    paddingTop: 22,
  },
  dots: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.gold,
  },
  title: {
    color: colors.text,
    fontFamily: typography.display,
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 32,
  },
  body: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 26,
  },
  next: {
    flex: 1,
  },
  skip: {
    width: 78,
  },
});
