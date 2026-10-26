import { isAxiosError } from 'axios';
import { z } from 'zod';

const responseEnvelopeSchema = z.object({ success: z.literal(true), data: z.unknown() });
const errorBodySchema = z.object({
  code: z.string().optional(),
  message: z.string().optional(),
  details: z
    .object({ nextAvailableAt: z.iso.datetime({ offset: true }).optional() })
    .passthrough()
    .optional(),
});

export function unwrapPointResponse(data: unknown) {
  const envelope = responseEnvelopeSchema.safeParse(data);
  return envelope.success ? envelope.data.data : data;
}

export function getPointRequestErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError<unknown>(error)) return fallback;
  if (error.response?.status === 401) return '로그인 후 다시 시도해 주세요.';
  if (!error.response || error.response.status >= 500) return fallback;
  const data = error.response.data;
  const body = errorBodySchema.safeParse(
    data && typeof data === 'object' && 'error' in data ? data.error : data,
  );
  if (!body.success) return fallback;
  if (body.data.code === 'ACCOUNT_CONCURRENT_UPDATE')
    return '계좌 정보가 변경되었습니다. 최신 정보를 확인한 후 다시 시도해 주세요.';
  if (body.data.code === 'POINT_GRANT_TOO_SOON')
    return '포인트 지급 후 24시간이 지나지 않았습니다.';
  return body.data.message?.trim() || fallback;
}
