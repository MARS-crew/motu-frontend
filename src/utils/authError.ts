import { isAxiosError } from 'axios';
import { z } from 'zod';

const authErrorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string().optional() }),
});

export function getAuthError(error: unknown) {
  if (!isAxiosError(error)) return null;
  const result = authErrorSchema.safeParse(error.response?.data);
  return result.success ? result.data.error : null;
}

export function getLoginRestriction(error: unknown) {
  if (!isAxiosError(error) || error.response?.status !== 403) return null;
  const code = getAuthError(error)?.code;
  if (code === 'AUTH_ACCOUNT_LOCKED') return 'locked';
  if (code === 'AUTH_ACCOUNT_BLOCKED') return 'suspended';
  return null;
}
