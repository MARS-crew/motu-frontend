import { z } from 'zod';

import { listingFileCollectionSchema } from '@/schemas/listingFileSchema';

export const listingApplicationDetailSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum([
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'REVISION_REQUESTED',
    'APPROVED',
    'REJECTED',
    'EXPIRED',
  ]),
  statusLabel: z.string(),
  applicationNumber: z.string().nullable(),
  submittedAt: z.iso.datetime({ offset: true }).nullable(),
  reviewComment: z.string().nullable(),
  revisionDeadline: z.iso.datetime({ offset: true }).nullable(),
  isEditable: z.boolean(),
  expiresAt: z.iso.datetime({ offset: true }).nullable(),
  data: z.object({ serviceName: z.string().nullish() }).passthrough(),
  attachments: z.object({
    logo: listingFileCollectionSchema.nullable(),
    mainImage: listingFileCollectionSchema.nullable(),
    evidence: listingFileCollectionSchema.nullable(),
  }),
  currentStep: z.number().int().min(1).max(4),
  lastSavedAt: z.iso.datetime({ offset: true }),
  createDate: z.iso.datetime({ offset: true }),
  modifiedDate: z.iso.datetime({ offset: true }),
});

export type ListingApplicationDetail = z.infer<typeof listingApplicationDetailSchema>;
