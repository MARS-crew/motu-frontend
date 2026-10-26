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
// 숫자·날짜도 문자열로 저장하여 작성 중인 값을 보존합니다.
export const listingTradingDraftDataSchema = z.object({
  desiredPrice: z.string().max(40, '희망 상장가는 40자 이하로 입력해 주세요.').nullable(),
  totalIssuedQuantity: z.string().max(40, '총 발행 수량은 40자 이하로 입력해 주세요.').nullable(),
  minOrderQuantity: z.string().max(40, '최소 주문 수량은 40자 이하로 입력해 주세요.').nullable(),
  tickSize: z.string().max(40, '호가 단위는 40자 이하로 입력해 주세요.').nullable(),
  priceCalculationBasis: z
    .string()
    .max(5000, '가격 산정 근거는 5,000자 이하로 입력해 주세요.')
    .nullable(),
  desiredListingDate: z.string().max(40, '거래 시작일시는 40자 이하로 입력해 주세요.').nullable(),
});
export const saveListingTradingDraftSchema = z.object({
  currentStep: z.literal(2),
  data: listingTradingDraftDataSchema,
});
export const listingDraftDetailSchema = listingDraftSummarySchema.extend({
  data: listingBasicDraftDataSchema
    .extend(listingTradingDraftDataSchema.shape)
    .partial()
    .passthrough(),
  applicationNumber: z.string().nullable(),
});
export const listingBasicStepResultSchema = listingDraftDetailSchema.extend({
  validatedStep: z.literal(1),
});
export type ListingBasicDraftData = z.infer<typeof listingBasicDraftDataSchema>;
export type SaveListingBasicDraft = z.infer<typeof saveListingBasicDraftSchema>;
export type ListingDraftDetail = z.infer<typeof listingDraftDetailSchema>;

export const listingTradingStepResultSchema = listingDraftDetailSchema.extend({
  validatedStep: z.literal(2),
});
export type SaveListingTradingDraft = z.infer<typeof saveListingTradingDraftSchema>;
export type ListingTradingDraftData = z.infer<typeof listingTradingDraftDataSchema>;
