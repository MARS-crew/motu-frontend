import { z } from 'zod';

export const listingApplicationEntrySchema = z.object({
  hasConfirmedCriteria: z.boolean().refine((value) => value, '상장 기준을 확인해 주세요.'),
});

export type ListingApplicationEntryForm = z.infer<typeof listingApplicationEntrySchema>;
