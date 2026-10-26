import { z } from 'zod';

import { listingApplicationDetailSchema } from '@/schemas/listingApplicationDetailSchema';
import { listingFileCollectionSchema } from '@/schemas/listingFileSchema';

export const listingRevisionSchema = z.object({
  id: z.number().int().positive(),
  requestContent: z.string(),
  deadline: z.iso.datetime({ offset: true }),
  isDeadlinePassed: z.boolean(),
  canResubmit: z.boolean(),
  resubmittedAt: z.iso.datetime({ offset: true }).nullable(),
  evidenceCollectionId: z.string().nullable(),
  evidence: listingFileCollectionSchema.nullable(),
  createDate: z.iso.datetime({ offset: true }),
});
export const listingRevisionsSchema = z.object({
  applicationId: z.number().int().positive(),
  applicationNumber: z.string().nullable(),
  status: listingApplicationDetailSchema.shape.status,
  items: z.array(listingRevisionSchema),
  page: z.number().int().positive(),
  size: z.number().int().positive(),
  totalCount: z.number().int().nonnegative(),
});
export const listingResubmitRequestSchema = z.object({ evidenceCollectionId: z.string().min(1) });
export const listingResubmitResultSchema = z.object({
  applicationId: z.number().int().positive(),
  applicationNumber: z.string().nullable(),
  status: listingApplicationDetailSchema.shape.status,
  revision: listingRevisionSchema,
});
export type ListingRevision = z.infer<typeof listingRevisionSchema>;
export type ListingResubmitRequest = z.infer<typeof listingResubmitRequestSchema>;
