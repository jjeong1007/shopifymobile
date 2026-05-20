import { useEffect, useState } from 'react';
import {
  getBannerToneFromColor,
  getBannerToneFromImage,
  type BannerBackgroundTone,
} from '../lib/bannerContrast';

export function useBannerContrast(
  bannerColor: string | null,
  bannerImageSrc: string | null,
): BannerBackgroundTone | null {
  const [tone, setTone] = useState<BannerBackgroundTone | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (bannerImageSrc) {
      setTone(null);
      getBannerToneFromImage(bannerImageSrc).then((result) => {
        if (!cancelled) setTone(result);
      });
      return () => {
        cancelled = true;
      };
    }

    if (bannerColor) {
      setTone(getBannerToneFromColor(bannerColor));
      return;
    }

    setTone('light');
    return undefined;
  }, [bannerColor, bannerImageSrc]);

  return tone;
}
