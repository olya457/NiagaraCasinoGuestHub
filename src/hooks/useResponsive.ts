import {useMemo} from 'react';
import {useWindowDimensions} from 'react-native';

export function useResponsive() {
  const {width, height} = useWindowDimensions();

  return useMemo(() => {
    const isNarrow = width < 370;
    const isSmallHeight = height < 740;
    const isTinyHeight = height < 660;
    const horizontalPadding = isNarrow ? 14 : 16;
    const tabHeight = isTinyHeight ? 58 : isSmallHeight ? 62 : 66;
    const heroHeight = isTinyHeight ? 148 : isSmallHeight ? 166 : 190;
    const listImageHeight = isTinyHeight ? 112 : isSmallHeight ? 124 : 142;
    const cardImageHeight = isTinyHeight ? 112 : isSmallHeight ? 124 : 136;
    const qrSize = isNarrow ? 172 : isSmallHeight ? 182 : 190;
    const fullQrSize = Math.min(isTinyHeight ? 196 : isSmallHeight ? 222 : 250, width - 92);

    return {
      width,
      height,
      isNarrow,
      isSmallHeight,
      isTinyHeight,
      horizontalPadding,
      tabHeight,
      heroHeight,
      listImageHeight,
      cardImageHeight,
      qrSize,
      fullQrSize,
    };
  }, [height, width]);
}
