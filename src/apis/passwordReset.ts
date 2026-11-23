import { api } from '@/apis/instance';
import {
  requestPasswordResetSchema,
  type RequestPasswordResetForm,
} from '@/schemas/accountRecoverySchema';
import {
  confirmPasswordResetSchema,
  passwordResetTokenSchema,
  passwordResetVerificationSchema,
  type ConfirmPasswordResetRequest,
  type PasswordResetToken,
} from '@/schemas/passwordResetSchema';
import type { ApiResponse } from '@/types/api';

export async function postRequestPasswordReset(body: RequestPasswordResetForm) {
  // 계정 존재 여부와 무관하게 같은 성공 응답을 사용합니다. 응답 DTO는 없습니다.
  await api.post('/auth/password-reset', requestPasswordResetSchema.parse(body));
}

export async function postVerifyPasswordReset(body: PasswordResetToken) {
  const { data } = await api.post<ApiResponse<unknown>>(
    '/auth/password-reset/verify',
    passwordResetTokenSchema.parse(body),
  );
  return passwordResetVerificationSchema.parse(data.data);
}

export async function postConfirmPasswordReset(body: ConfirmPasswordResetRequest) {
  // 성공 응답에 데이터가 없는 API이므로 HTTP 성공 여부만 확인합니다.
  await api.post('/auth/password-reset/confirm', confirmPasswordResetSchema.parse(body));
}
