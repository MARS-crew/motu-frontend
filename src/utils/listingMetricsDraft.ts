import type { ListingDraftDetail, ListingMetricsDraftData } from '@/schemas/listingDraftSchema';
import type { ListingMetricsForm } from '@/schemas/listingMetricsSchema';
import {
  getMetricReferenceDate,
  getCompletedMetricPeriod,
  isValidMetricRange,
} from '@/utils/listingMetricsDate';

const TRANSACTION_BASIS_API_VALUES: Record<ListingMetricsForm['transactionBasis'], string> = {
  lastTwelveMonths: 'LAST_12_MONTHS',
  entireOperation: 'SINCE_LAUNCH',
};

export function toListingMetricsBasis(
  value: string | null | undefined,
): ListingMetricsForm['transactionBasis'] {
  if (value === 'LAST_12_MONTHS' || !value) return 'lastTwelveMonths';
  if (value === 'SINCE_LAUNCH') return 'entireOperation';
  return value as ListingMetricsForm['transactionBasis'];
}

type ListingMetricsDraftOptions = {
  referenceDate?: string;
  savedData?: ListingDraftDetail['data'];
};

export function toListingMetricsDraftData(
  values: ListingMetricsForm,
  { referenceDate = getMetricReferenceDate(), savedData }: ListingMetricsDraftOptions = {},
): ListingMetricsDraftData {
  const savedRange = {
    start: savedData?.metricsStartDate ?? '',
    end: savedData?.metricsEndDate ?? '',
  };
  const period =
    values.transactionBasis === 'lastTwelveMonths'
      ? getCompletedMetricPeriod(referenceDate)
      : values.transactionBasis === 'entireOperation' &&
          toListingMetricsBasis(savedData?.transactionVolumeBasis) === 'entireOperation' &&
          isValidMetricRange(savedRange)
        ? savedRange
        : null;
  const numericText = (value: string) => {
    const text = value.trim();
    return (/^\d{1,3}(?:,\d{3})+$/.test(text) ? text.replaceAll(',', '') : text) || null;
  };
  return {
    ...(period ? { metricsStartDate: period.start, metricsEndDate: period.end } : {}),
    mau: numericText(values.mau),
    dau: numericText(values.dau),
    revenue: numericText(values.annualRevenue),
    transactionVolume: numericText(values.transactionAmount),
    revenueStartDate: values.revenuePeriod.start.trim() || null,
    revenueEndDate: values.revenuePeriod.end.trim() || null,
    revenueSource: values.revenueSource.trim() || null,
    revenueExtractDate: values.revenueExtractedAt.trim() || null,
    transactionVolumeBasis:
      TRANSACTION_BASIS_API_VALUES[values.transactionBasis] ?? (values.transactionBasis || null),
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
    transactionBasis: toListingMetricsBasis(data.transactionVolumeBasis),
    transactionSource: data.transactionVolumeSource ?? '',
    transactionExtractedAt: data.transactionVolumeExtractDate ?? '',
  };
}
