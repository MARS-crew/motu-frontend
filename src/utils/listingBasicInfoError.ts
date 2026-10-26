import { isAxiosError } from 'axios';
import { z } from 'zod';

import type { ListingBasicInfoForm } from '@/schemas/listingBasicInfoSchema';

const BASIC_INFO_API_FIELDS: Record<string, keyof ListingBasicInfoForm> = {
  serviceName: 'serviceName',
  summary: 'introduction',
  description: 'description',
  sectorCode: 'category',
  logoCollectionId: 'logo',
  mainImageCollectionId: 'coverImage',
  officialUrl: 'officialUrl',
  operatorName: 'companyName',
  managerName: 'contactName',
  businessEmail: 'email',
  contactPhone: 'phone',
};
const errorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string(), details: z.unknown().optional() }),
});
const fieldErrorsSchema = z.record(z.string(), z.union([z.string(), z.array(z.string())]));

export function getListingBasicInfoError(error: unknown) {
  const fallback = '신청서를 저장하지 못했습니다. 입력 내용은 유지됩니다. 다시 시도해 주세요.';
  const result: { message: string; fields: Partial<Record<keyof ListingBasicInfoForm, string>> } = {
    message: fallback,
    fields: {},
  };
  if (error instanceof ListingBasicInfoSaveError) {
    result.message = error.message;
    if (error.field) result.fields[error.field] = error.message;
    return result;
  }
  if (!isAxiosError<unknown>(error)) return result;
  const parsed = errorSchema.safeParse(error.response?.data);
  if (!parsed.success) return result;
  const { code, message, details } = parsed.data.error;
  result.message = message.trim() || fallback;
  if (code === 'LISTING_INVALID_URL' || code === 'LISTING_URL_IN_PROGRESS')
    result.fields.officialUrl = result.message;
  if (details && typeof details === 'object' && 'fieldErrors' in details) {
    const fieldErrors = fieldErrorsSchema.safeParse(details.fieldErrors);
    if (fieldErrors.success)
      for (const [name, messages] of Object.entries(fieldErrors.data)) {
        const field = BASIC_INFO_API_FIELDS[name.replace(/^data\./, '')];
        const text = Array.isArray(messages) ? messages[0] : messages;
        if (field && text) result.fields[field] = text;
      }
  }
  return result;
}

export class ListingBasicInfoSaveError extends Error {
  readonly field?: keyof ListingBasicInfoForm;

  constructor(message: string, field?: keyof ListingBasicInfoForm) {
    super(message);
    this.field = field;
  }
}

export const getListingBasicInfoField = (name: string) =>
  BASIC_INFO_API_FIELDS[name.replace(/^data\./, '')];
