import { api } from '@/apis/instance';
import { signupAvailabilitySchema } from '@/schemas/signupAvailabilitySchema';
import { signupIdSchema, signupNicknameSchema } from '@/schemas/signupInfoSchema';
import type { ApiResponse } from '@/types/api';
import { verificationDeliverySchema } from '@/schemas/loginVerificationSchema';
import {
  signupEmailRequestSchema,
  signupEmailConfirmSchema,
  signupEmailConfirmedSchema,
  signupRequestSchema,
  signupResponseSchema,
  type SignupRequest,
  type SignupEmailConfirmation,
} from '@/schemas/signupRequestSchema';

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

export async function postSignupEmail(email: string) {
  const { data } = await api.post<ApiResponse<unknown>>(
    '/users/email-verifications',
    signupEmailRequestSchema.parse({ email }),
  );
  return verificationDeliverySchema.parse(data.data);
}

export async function postConfirmSignupEmail(body: SignupEmailConfirmation) {
  const { data } = await api.post<ApiResponse<unknown>>(
    '/users/email-verifications/confirm',
    signupEmailConfirmSchema.parse(body),
  );
  return signupEmailConfirmedSchema.parse(data.data);
}

export async function postSignup(body: SignupRequest) {
  const { data } = await api.post<ApiResponse<unknown>>('/users', signupRequestSchema.parse(body));
  return signupResponseSchema.parse(data.data);
}
