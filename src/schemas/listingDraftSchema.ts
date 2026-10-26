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
