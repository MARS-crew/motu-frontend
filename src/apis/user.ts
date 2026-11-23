import { api } from '@/apis/instance';
import { verificationDeliverySchema } from '@/schemas/loginVerificationSchema';
import { myInfoSchema } from '@/schemas/myInfoSchema';
import {
  profileEditEmailConfirmedSchema,
  profileEditVerifySchema,
  profileUpdateRequestSchema,
  profileUpdateResponseSchema,
  type ProfileEditVerifyForm,
  type ProfileUpdateRequest,
} from '@/schemas/profileEditSchema';
import { withdrawalSchema, type WithdrawalForm } from '@/schemas/withdrawalSchema';
import type { ApiResponse } from '@/types/api';

export const getMyInfo = async (signal?: AbortSignal) => {
  const { data } = await api.get<ApiResponse<unknown>>('/users/me', { signal });
  return myInfoSchema.parse(data.data);
};

// 회원정보 수정 전 가입 이메일로 인증번호를 보냅니다. 가입 이메일과 다르면 USER_EMAIL_MISMATCH입니다.
export const postProfileEditEmail = async (email: string) => {
  const { data } = await api.post<ApiResponse<unknown>>(
    '/users/me/email-verifications',
    profileEditVerifySchema.pick({ email: true }).parse({ email }),
  );
  return verificationDeliverySchema.parse(data.data);
};

export const postConfirmProfileEditEmail = async (body: ProfileEditVerifyForm) => {
  const { data } = await api.post<ApiResponse<unknown>>(
    '/users/me/email-verifications/confirm',
    profileEditVerifySchema.parse(body),
  );
  return profileEditEmailConfirmedSchema.parse(data.data);
};

export const patchMyProfile = async (body: ProfileUpdateRequest) => {
  const { data } = await api.patch<ApiResponse<unknown>>(
    '/users/me',
    profileUpdateRequestSchema.parse(body),
  );
  return profileUpdateResponseSchema.parse(data.data);
};

// 성공 응답은 본문 없는 204입니다.
export async function postWithdrawal(body: WithdrawalForm) {
  await api.post<void>('/users/me/withdrawal', withdrawalSchema.parse(body));
}
