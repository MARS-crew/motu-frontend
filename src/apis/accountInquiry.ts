import { api } from '@/apis/instance';
import {
  accountInquiryResponseSchema,
  accountInquirySchema,
  type AccountInquiryForm,
} from '@/schemas/accountInquirySchema';
import type { ApiResponse } from '@/types/api';

export async function postAccountInquiry(body: AccountInquiryForm) {
  const { data } = await api.post<ApiResponse<unknown>>(
    '/account-inquiries',
    accountInquirySchema.parse(body),
  );
  return accountInquiryResponseSchema.parse(data.data);
}
