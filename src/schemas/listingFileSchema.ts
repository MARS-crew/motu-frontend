import { z } from 'zod';

export const listingAttachmentSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(['FILE', 'LINK']),
  originalName: z.string().nullish(),
  contentType: z.string().nullish(),
  size: z.union([z.number().nonnegative(), z.string().regex(/^\d+$/).transform(Number)]).nullish(),
  saved: z.boolean(),
  url: z.string().nullish(),
  downloadPath: z.string().nullable(),
});
export const listingFileCollectionSchema = z.object({
  id: z.string().min(1),
  purpose: z.enum(['LOGO', 'MAIN_IMAGE', 'EVIDENCE']),
  description: z.string().nullable(),
  attachments: z.array(listingAttachmentSchema),
});
export type ListingAttachment = z.infer<typeof listingAttachmentSchema>;
export type ListingFileCollection = z.infer<typeof listingFileCollectionSchema>;
