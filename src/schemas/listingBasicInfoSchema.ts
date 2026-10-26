import { z } from 'zod';

export const MAX_LISTING_IMAGE_BYTES = 10 * 1024 * 1024;
export const LISTING_IMAGE_SIZE_ERROR =
  '파일 용량이 10MB를 초과했습니다.\n10MB 이하의 파일을 선택해 주세요.';
export const LISTING_CATEGORIES = [
  'AI / 데이터',
  'SaaS / 소프트웨어',
  '핀테크',
  '커머스 / 유통',
  '콘텐츠 / 미디어',
  '헬스케어',
  '교육',
  '모빌리티',
  '기타',
] as const;

export const listingImageSchema = z
  .object({
    uri: z.string(),
    name: z.string(),
    size: z.number().nonnegative(),
    mimeType: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
    isPreview: z.boolean().optional(),
    collectionId: z.string().optional(),
    attachmentId: z.string().optional(),
  })
  .refine((file) => file.size <= MAX_LISTING_IMAGE_BYTES, LISTING_IMAGE_SIZE_ERROR)
  .refine(
    (file) => ['image/jpeg', 'image/png'].includes(file.mimeType),
    'JPG·JPEG·PNG 형식의 파일을 선택해 주세요.',
  );

export const listingBasicInfoSchema = z.object({
  serviceName: z
    .string()
    .trim()
    .min(1, '필수 입력 항목입니다.')
    .max(30, '서비스명은 30자 이하로 입력해 주세요.'),
  introduction: z
    .string()
    .trim()
    .min(1, '필수 입력 항목입니다.')
    .min(10, '한 줄 소개는 10~60자로 입력해 주세요.')
    .max(60, '한 줄 소개는 10~60자로 입력해 주세요.'),
  description: z.string().max(500, '상세 설명은 500자 이하로 입력해 주세요.'),
  category: z
    .string()
    .refine(
      (value) => LISTING_CATEGORIES.some((category) => category === value),
      '카테고리를 선택해 주세요.',
    ),
  logo: listingImageSchema.nullable(),
  coverImage: listingImageSchema
    .nullable()
    .refine((value): boolean => value !== null, '대표 이미지를 등록해 주세요.'),
  officialUrl: z
    .string()
    .trim()
    .max(2048, '공식 URL은 2,048자 이하로 입력해 주세요.')
    .refine((value) => {
      if (!value) return true;
      try {
        const url = new URL(value);
        return (
          url.protocol === 'https:' && url.hostname.includes('.') && !url.username && !url.password
        );
      } catch {
        return false;
      }
    }, 'https://로 시작하는 올바른 주소를 입력해 주세요.'),
  companyName: z
    .string()
    .trim()
    .min(1, '운영사명을 입력해 주세요.')
    .max(50, '운영사명은 50자 이하로 입력해 주세요.'),
  contactName: z
    .string()
    .trim()
    .min(1, '담당자명을 입력해 주세요.')
    .max(50, '담당자명은 50자 이하로 입력해 주세요.'),
  email: z
    .string()
    .trim()
    .max(255, '이메일은 255자 이하로 입력해 주세요.')
    .min(1, '필수 입력 항목입니다.')
    .refine(
      (value) => !value || z.email().safeParse(value).success,
      '올바른 이메일 형식으로 입력해 주세요.',
    ),
  phone: z
    .string()
    .trim()
    .max(30, '연락처는 30자 이하로 입력해 주세요.')
    .min(1, '필수 입력 항목입니다.')
    .refine(
      (value) => !value || /^010-\d{4}-\d{4}$/.test(value),
      '010-1234-5678 형식으로 입력해 주세요.',
    ),
});

export type ListingImage = z.infer<typeof listingImageSchema>;
export type ListingBasicInfoForm = z.infer<typeof listingBasicInfoSchema>;
