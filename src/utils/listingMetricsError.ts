import { isAxiosError } from 'axios';
import { z, ZodError } from 'zod';

import type { ListingMetricsForm } from '@/schemas/listingMetricsSchema';

const METRICS_API_FIELDS: Record<string, keyof ListingMetricsForm> = {
  mau: 'mau',
  dau: 'dau',
  revenue: 'annualRevenue',
  transactionVolume: 'transactionAmount',
  revenueStartDate: 'revenuePeriod',
  revenueEndDate: 'revenuePeriod',
  revenueSource: 'revenueSource',
  revenueExtractDate: 'revenueExtractedAt',
  transactionVolumeBasis: 'transactionBasis',
  transactionVolumeSource: 'transactionSource',
  transactionVolumeExtractDate: 'transactionExtractedAt',
};
const messageSchema = z.object({ error: z.object({ message: z.string() }) });
const fieldsSchema = z.object({
  error: z.object({
    details: z.object({
      fieldErrors: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
    }),
  }),
});

export function getListingMetricsError(error: unknown) {
  const result: { message: string; fields: Partial<Record<keyof ListingMetricsForm, string>> } = {
    message: '신청서를 저장하지 못했습니다. 입력 내용은 유지됩니다. 다시 시도해 주세요.',
    fields: {},
  };
  if (error instanceof ZodError) {
    for (const issue of error.issues) {
      const name = String(issue.path[0] === 'data' ? issue.path[1] : issue.path[0]);
      const field =
        METRICS_API_FIELDS[name] ??
        Object.values(METRICS_API_FIELDS).find((value) => value === name);
      if (field && !result.fields[field]) result.fields[field] = issue.message;
    }
    result.message = error.issues[0]?.message ?? result.message;
    return result;
  }
  if (!isAxiosError(error)) return result;
  const body = error.response?.data;
  const message = messageSchema.safeParse(body);
  if (message.success && message.data.error.message.trim())
    result.message = message.data.error.message;
  const fields = fieldsSchema.safeParse(body);
  if (fields.success)
    for (const [name, messages] of Object.entries(fields.data.error.details.fieldErrors)) {
      const field = METRICS_API_FIELDS[name.replace(/^data\./, '')];
      const text = Array.isArray(messages) ? messages[0] : messages;
      if (field && text && !result.fields[field]) result.fields[field] = text;
    }
  return result;
}
