import { api } from '@/apis/instance';
import { verificationDeliverySchema } from '@/schemas/loginVerificationSchema';
import { myInfoSchema } from '@/schemas/myInfoSchema';
import {
  phoneChangeConfirmedSchema,
  phoneChangeSchema,
  profileEditEmailConfirmedSchema,
  profileEditVerifySchema,
  profileUpdateRequestSchema,
  profileUpdateResponseSchema,
  type PhoneChangeForm,
  type ProfileEditVerifyForm,
  type ProfileUpdateRequest,
} from '@/schemas/profileEditSchema';
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

// 새 번호로 연락처 변경 인증번호(SMS)를 보냅니다. 2차 보안을 설정한 회원만 쓸 수 있습니다.
export const postPhoneChangeVerification = async (phoneNumber: string) => {
  const { data } = await api.post<ApiResponse<unknown>>(
    '/users/me/phone-verifications',
    phoneChangeSchema.pick({ phoneNumber: true }).parse({ phoneNumber }),
  );
  return verificationDeliverySchema.parse(data.data);
};

export const postConfirmPhoneChangeVerification = async (body: PhoneChangeForm) => {
  const { data } = await api.post<ApiResponse<unknown>>(
    '/users/me/phone-verifications/confirm',
    phoneChangeSchema.parse(body),
  );
  return phoneChangeConfirmedSchema.parse(data.data);
};

// 인증을 마친 번호로 연락처를 바꿉니다. 인증 결과는 저장에 한 번만 쓸 수 있습니다.
export const patchMyPhoneNumber = async (phoneNumber: string) => {
  const { data } = await api.patch<ApiResponse<unknown>>(
    '/users/me/phone-number',
    phoneChangeSchema.pick({ phoneNumber: true }).parse({ phoneNumber }),
  );
  return myInfoSchema.parse(data.data);
};
