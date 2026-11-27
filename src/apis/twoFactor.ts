import {
  secondFactorPhoneSchema,
  secondFactorSchema,
  type SecondFactorForm,
} from '@/schemas/secondFactorSchema';
import {
  twoFactorCodeSchema,
  twoFactorDeliverySchema,
  twoFactorSessionSchema,
  type TwoFactorCodeForm,
} from '@/schemas/twoFactorSessionSchema';
import { api } from '@/apis/instance';
import { twoFactorSchema } from '@/schemas/twoFactorSchema';
import type { ApiResponse } from '@/types/api';

export async function getTwoFactor(signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<unknown>>('/two-factor', { signal });
  return twoFactorSchema.parse(data.data);
}

export async function postTwoFactorVerification() {
  const { data } = await api.post<ApiResponse<unknown>>('/two-factor/verifications');
  return twoFactorDeliverySchema.parse(data.data);
}
export async function postConfirmTwoFactorVerification(body: TwoFactorCodeForm) {
  const { data } = await api.post<ApiResponse<unknown>>(
    '/two-factor/verifications/confirm',
    twoFactorCodeSchema.parse(body),
  );
  return twoFactorSessionSchema.parse(data.data);
}

export async function postTwoFactorPhoneVerification(phone: string) {
  const phoneNumber = secondFactorPhoneSchema.parse(phone);
  const { data } = await api.post<ApiResponse<unknown>>('/two-factor/phone-verifications', {
    phoneNumber,
  });
  return { ...twoFactorDeliverySchema.parse(data.data), phoneNumber };
}
export async function postConfirmTwoFactorPhoneVerification(body: SecondFactorForm) {
  const { phone: phoneNumber, code } = secondFactorSchema.parse(body);
  const { data } = await api.post<ApiResponse<unknown>>('/two-factor/phone-verifications/confirm', {
    phoneNumber,
    code,
  });
  return twoFactorSchema.parse(data.data);
}
