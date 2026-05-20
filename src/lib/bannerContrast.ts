/** Background is dark → use light foreground; background is light → use dark foreground */
export type BannerBackgroundTone = 'dark' | 'light';

function relativeLuminance(r: number, g: number, b: number): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function parseHexColor(hex: string): [number, number, number] | null {
  const normalized = hex.replace('#', '').trim();
  if (normalized.length !== 3 && normalized.length !== 6) return null;
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return [r, g, b];
}

const LUMINANCE_THRESHOLD = 0.45;

export function getBannerToneFromColor(hex: string): BannerBackgroundTone {
  const rgb = parseHexColor(hex);
  if (!rgb) return 'light';
  const [r, g, b] = rgb;
  return relativeLuminance(r, g, b) < LUMINANCE_THRESHOLD ? 'dark' : 'light';
}

function sampleWeight(y: number, height: number): number {
  if (y < height * 0.38) return 2.2;
  if (y > height * 0.52) return 2;
  return 1;
}

export function getBannerToneFromImage(src: string): Promise<BannerBackgroundTone> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = Math.min(img.naturalWidth, 160);
      const height = Math.min(img.naturalHeight, 100);
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        resolve('light');
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const { data } = ctx.getImageData(0, 0, width, height);
      let weightedSum = 0;
      let totalWeight = 0;

      for (let y = 0; y < height; y += 1) {
        const rowWeight = sampleWeight(y, height);
        for (let x = 0; x < width; x += 1) {
          const i = (y * width + x) * 4;
          const alpha = data[i + 3];
          if (alpha < 40) continue;
          weightedSum +=
            relativeLuminance(data[i], data[i + 1], data[i + 2]) * rowWeight;
          totalWeight += rowWeight;
        }
      }

      const average = totalWeight > 0 ? weightedSum / totalWeight : 0.55;
      resolve(average < LUMINANCE_THRESHOLD ? 'dark' : 'light');
    };
    img.onerror = () => resolve('light');
    img.src = src;
  });
}
