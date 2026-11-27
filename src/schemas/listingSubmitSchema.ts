import { z } from 'zod';
import { listingApplicationDetailSchema } from '@/schemas/listingApplicationDetailSchema';

export const listingSubmitRequestSchema = z.object({
  expectedLastSavedAt: z.iso.datetime({ offset: true }),
});
export const listingSubmitResultSchema = z.object({
  applicationId: z.number().int().positive(),
  applicationNumber: z.string().min(1),
  status: listingApplicationDetailSchema.shape.status,
  submittedAt: z.iso.datetime({ offset: true }),
  replayed: z.boolean(),
});
export type ListingSubmitRequest = z.infer<typeof listingSubmitRequestSchema>;
