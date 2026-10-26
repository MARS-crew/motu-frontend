import { z } from 'zod';

export const listingDraftSummarySchema = z.object({
  id: z.number().int().positive(),
  status: z.literal('DRAFT'),
  serviceName: z.string().nullable(),
  currentStep: z.number().int().min(1).max(4),
  lastSavedAt: z.iso.datetime({ offset: true }),
  expiresAt: z.iso.datetime({ offset: true }),
  expiresSoon: z.boolean(),
});

export const listingDraftListSchema = z.object({
  items: z.array(listingDraftSummarySchema),
  totalCount: z.number().int().nonnegative(),
  maxCount: z.number().int().nonnegative(),
  canCreate: z.boolean(),
});

export type ListingDraftSummary = z.infer<typeof listingDraftSummarySchema>;
export type ListingDraftList = z.infer<typeof listingDraftListSchema>;

// 임시저장은 필수값/완성된 형식을 강제하지 않고 서버의 길이 제한만 검사합니다.
export const listingBasicDraftDataSchema = z.object({
  serviceName: z.string().max(30).nullable(),
  summary: z.string().max(60).nullable(),
  description: z.string().max(500).nullable(),
  officialUrl: z.string().max(2048).nullable(),
  operatorName: z.string().max(50).nullable(),
  managerName: z.string().max(50).nullable(),
  businessEmail: z.string().max(255).nullable(),
  contactPhone: z.string().max(30).nullable(),
  sectorCode: z.number().int().positive().nullable(),
  logoCollectionId: z.string().min(1).nullable(),
  mainImageCollectionId: z.string().min(1).nullable(),
});
export const saveListingBasicDraftSchema = z.object({
  currentStep: z.literal(1),
  data: listingBasicDraftDataSchema,
});
export const listingDraftDetailSchema = listingDraftSummarySchema.extend({
  data: listingBasicDraftDataSchema.partial().passthrough(),
  applicationNumber: z.string().nullable(),
});
export const listingBasicStepResultSchema = listingDraftDetailSchema.extend({
  validatedStep: z.literal(1),
});
export type ListingBasicDraftData = z.infer<typeof listingBasicDraftDataSchema>;
export type SaveListingBasicDraft = z.infer<typeof saveListingBasicDraftSchema>;
export type ListingDraftDetail = z.infer<typeof listingDraftDetailSchema>;
