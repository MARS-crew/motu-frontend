import { api } from '@/apis/instance';
import { findIdSchema, type FindIdForm } from '@/schemas/accountRecoverySchema';
import {
  findIdDeliverySchema,
  findIdResultSchema,
  sendFindIdCodeSchema,
  type SendFindIdCodeRequest,
} from '@/schemas/findIdApiSchema';
import type { ApiResponse } from '@/types/api';

export async function postSendFindIdCode(body: SendFindIdCodeRequest) {
  const { data } = await api.post<ApiResponse<unknown>>(
    '/auth/find-login-id/email-verifications',
    sendFindIdCodeSchema.parse(body),
  );
  return findIdDeliverySchema.parse(data.data);
}

export async function postFindLoginId(body: FindIdForm) {
  const { data } = await api.post<ApiResponse<unknown>>(
    '/auth/find-login-id/email-verifications/confirm',
    findIdSchema.parse(body),
  );
  return findIdResultSchema.parse(data.data);
}
