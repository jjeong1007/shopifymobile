import { Icon } from '@shopify/polaris';
import type { IconSource } from '@shopify/polaris';

type PolarisIconProps = {
  source: IconSource;
  tone?: 'base' | 'subdued' | 'success' | 'critical' | 'caution' | 'interactive' | 'info' | 'warning' | 'primary' | 'emphasis' | 'magic' | 'textCaution' | 'textWarning' | 'textCritical' | 'textInfo' | 'textSuccess' | 'textPrimary' | 'textMagic';
  className?: string;
};

export function PolarisIcon({ source, tone = 'base', className }: PolarisIconProps) {
  return (
    <span className={className} aria-hidden>
      <Icon source={source} tone={tone} />
    </span>
  );
}
