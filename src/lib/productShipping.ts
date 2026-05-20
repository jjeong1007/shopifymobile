import { formatShopLocationSubtitle, getShopLocation } from './shopLocation';
import { isShippingConfirmed } from './shopStore';
import {
  formatRateDescription,
  formatRatePrice,
  getDomesticShippingRates,
  getShippingRates,
  type ShippingRate,
} from './shippingRates';

export type ProductShippingSummary = {
  confirmed: boolean;
  locationLabel: string;
  domesticRates: ShippingRate[];
  internationalRate: ShippingRate;
  domesticCount: number;
  internationalPrice: string;
};

export function getProductShippingSummary(): ProductShippingSummary {
  const location = getShopLocation();
  const domesticRates = getDomesticShippingRates();
  const internationalRate = getShippingRates()['international-standard'];
  const confirmed = isShippingConfirmed();
  const locationLabel = formatShopLocationSubtitle(location);

  if (!confirmed) {
    return {
      confirmed: false,
      locationLabel,
      domesticRates,
      internationalRate,
      domesticCount: domesticRates.length,
      internationalPrice: formatRatePrice(internationalRate),
    };
  }

  return {
    confirmed: true,
    locationLabel,
    domesticRates,
    internationalRate,
    domesticCount: domesticRates.length,
    internationalPrice: formatRatePrice(internationalRate),
  };
}

export function formatProductShippingRateLine(rate: ShippingRate): string {
  return `${rate.name} · ${formatRatePrice(rate)}`;
}

export { formatRateDescription, formatRatePrice };
