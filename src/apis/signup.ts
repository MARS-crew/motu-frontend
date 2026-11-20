import { api } from '@/apis/instance';
import { signupAvailabilitySchema } from '@/schemas/signupAvailabilitySchema';
import { signupIdSchema, signupNicknameSchema } from '@/schemas/signupInfoSchema';
import type { ApiResponse } from '@/types/api';

export type SignupAvailabilityField = 'loginId' | 'nickname';
export const SIGNUP_AVAILABILITY_SCHEMAS = {
  loginId: signupIdSchema,
  nickname: signupNicknameSchema,
};

export async function getSignupAvailability(
  field: SignupAvailabilityField,
  value: string,
  signal?: AbortSignal,
) {
  const validated = SIGNUP_AVAILABILITY_SCHEMAS[field].parse(value);
  const path =
    field === 'loginId' ? '/users/login-id/availability' : '/users/nickname/availability';
  const { data } = await api.get<ApiResponse<unknown>>(path, {
    params: { [field]: validated },
    signal,
  });
  return signupAvailabilitySchema.parse(data.data);
}
