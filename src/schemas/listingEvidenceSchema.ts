import { z } from 'zod';

export const MAX_EVIDENCE_ITEMS = 10;
export const MAX_EVIDENCE_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_EVIDENCE_PDF_BYTES = 20 * 1024 * 1024;
export const EVIDENCE_DESCRIPTION_ERROR = '자료 설명은 필수 입력값입니다. (10자 이상 500자 이하)';
export const EVIDENCE_COUNT_ERROR = '파일과 링크는 합산해 최대 10개까지 등록할 수 있습니다.';
export const EVIDENCE_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export const evidenceLinkSchema = z
  .string()
  .trim()
  .refine((value) => {
    try {
      const url = new URL(value);
      return (
        ['https:', 'http:'].includes(url.protocol) &&
        !!url.hostname &&
        !url.username &&
        !url.password
      );
    } catch {
      return false;
    }
  }, '올바른 외부 링크 URL을 입력해 주세요.');

export const evidenceFileSchema = z
  .object({
    id: z.string().min(1),
    kind: z.literal('file'),
    name: z.string().min(1),
    uri: z.string().min(1),
    size: z.number().nonnegative().finite(),
    mimeType: z.string(),
  })
  .superRefine((file, context) => {
    const isSupported =
      (file.mimeType === 'application/pdf' && /\.pdf$/i.test(file.name)) ||
      (file.mimeType === 'image/png' && /\.png$/i.test(file.name)) ||
      (file.mimeType === 'image/jpeg' && /\.jpe?g$/i.test(file.name));
    if (!isSupported) {
      context.addIssue({
        code: 'custom',
        message: 'JPG, JPEG, PNG, PDF 파일만 첨부할 수 있습니다.',
      });
    } else if (
      file.size >
      (file.mimeType === 'application/pdf' ? MAX_EVIDENCE_PDF_BYTES : MAX_EVIDENCE_IMAGE_BYTES)
    ) {
      context.addIssue({
        code: 'custom',
        message:
          file.mimeType === 'application/pdf'
            ? 'PDF는 파일당 20MB 이하만 첨부할 수 있습니다.'
            : '이미지는 파일당 10MB 이하만 첨부할 수 있습니다.',
      });
    }
  });
export const evidenceItemSchema = z.union([
  evidenceFileSchema,
  z.object({ id: z.string().min(1), kind: z.literal('link'), url: evidenceLinkSchema }),
]);
export const listingEvidenceSchema = z.object({
  items: z.array(evidenceItemSchema).max(MAX_EVIDENCE_ITEMS, EVIDENCE_COUNT_ERROR),
  linkUrl: z
    .string()
    .refine(
      (value) => !value.trim() || evidenceLinkSchema.safeParse(value).success,
      '올바른 외부 링크 URL을 입력해 주세요.',
    ),
  description: z
    .string()
    .trim()
    .min(10, EVIDENCE_DESCRIPTION_ERROR)
    .max(500, EVIDENCE_DESCRIPTION_ERROR),
});

export type ListingEvidenceForm = z.infer<typeof listingEvidenceSchema>;
export type EvidenceItem = z.infer<typeof evidenceItemSchema>;
export type EvidenceFile = z.infer<typeof evidenceFileSchema>;
