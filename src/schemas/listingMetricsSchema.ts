import { z } from 'zod';

import { isValidMetricDate, isValidMetricRange } from '@/utils/listingMetricsDate';

const optionalMetricNumber = z
  .string()
  .trim()
  .max(40, '40자 이하로 입력해 주세요.')
  .refine(
    (value) =>
      !value ||
      (/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value) &&
        Number.isSafeInteger(Number(value.replaceAll(',', ''))) &&
        Number(value.replaceAll(',', '')) >= 0),
    '0 이상의 정수를 입력해 주세요.',
  );
const optionalMetricDate = z
  .string()
  .trim()
  .max(40, '날짜는 40자 이하로 입력해 주세요.')
  .refine((value) => !value || isValidMetricDate(value), '올바른 날짜를 선택해 주세요.');

export const listingMetricsSchema = z.object({
  mau: optionalMetricNumber,
  dau: optionalMetricNumber,
  annualRevenue: optionalMetricNumber,
  revenuePeriod: z
    .object({
      start: z.string().trim().max(40, '시작일은 40자 이하로 입력해 주세요.'),
      end: z.string().trim().max(40, '종료일은 40자 이하로 입력해 주세요.'),
    })
    .refine(
      (range) => (!range.start && !range.end) || isValidMetricRange(range),
      '시작일과 종료일을 선택해 주세요. 집계 기간은 12개월 이하여야 합니다.',
    ),
  revenueSource: z.string().trim().max(255, '출처명은 255자 이하로 입력해 주세요.'),
  revenueExtractedAt: optionalMetricDate,
  transactionAmount: optionalMetricNumber,
  transactionBasis: z.enum(['lastTwelveMonths', 'entireOperation'], {
    error: '거래액 집계 기준을 선택해 주세요.',
  }),
  transactionSource: z.string().trim().max(255, '출처명은 255자 이하로 입력해 주세요.'),
  transactionExtractedAt: optionalMetricDate,
});

export type ListingMetricsForm = z.infer<typeof listingMetricsSchema>;
