import type { ListingDraftDetail, ListingMetricsDraftData } from '@/schemas/listingDraftSchema';
import type { ListingMetricsForm } from '@/schemas/listingMetricsSchema';

export function toListingMetricsDraftData(values: ListingMetricsForm): ListingMetricsDraftData {
  const numericText = (value: string) => {
    const text = value.trim();
    return (/^\d{1,3}(?:,\d{3})+$/.test(text) ? text.replaceAll(',', '') : text) || null;
  };
  return {
    mau: numericText(values.mau),
    dau: numericText(values.dau),
    revenue: numericText(values.annualRevenue),
    transactionVolume: numericText(values.transactionAmount),
    revenueStartDate: values.revenuePeriod.start.trim() || null,
    revenueEndDate: values.revenuePeriod.end.trim() || null,
    revenueSource: values.revenueSource.trim() || null,
    revenueExtractDate: values.revenueExtractedAt.trim() || null,
    transactionVolumeBasis: values.transactionBasis || null,
    transactionVolumeSource: values.transactionSource.trim() || null,
    transactionVolumeExtractDate: values.transactionExtractedAt.trim() || null,
  };
}

export function toListingMetricsForm(draft: ListingDraftDetail): ListingMetricsForm {
  const data = draft.data;
  const displayNumber = (value: string | null | undefined) => {
    if (!value) return '';
    const number = Number(value.replaceAll(',', ''));
    return /^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value) && Number.isSafeInteger(number)
      ? number.toLocaleString('en-US')
      : value;
  };
  return {
    mau: displayNumber(data.mau),
    dau: displayNumber(data.dau),
    annualRevenue: displayNumber(data.revenue),
    revenuePeriod: { start: data.revenueStartDate ?? '', end: data.revenueEndDate ?? '' },
    revenueSource: data.revenueSource ?? '',
    revenueExtractedAt: data.revenueExtractDate ?? '',
    transactionAmount: displayNumber(data.transactionVolume),
    // 미완성/비허용 값은 임의 변경하지 않고 '다음'에서 검증합니다.
    transactionBasis: (data.transactionVolumeBasis ??
      'lastTwelveMonths') as ListingMetricsForm['transactionBasis'],
    transactionSource: data.transactionVolumeSource ?? '',
    transactionExtractedAt: data.transactionVolumeExtractDate ?? '',
  };
}
