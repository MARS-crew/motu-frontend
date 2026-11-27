import { api } from '@/apis/instance';
import {
  listingSubmitRequestSchema,
  listingSubmitResultSchema,
  type ListingSubmitRequest,
} from '@/schemas/listingSubmitSchema';
import type { ApiResponse } from '@/types/api';

export async function submitListing(id: number, body: ListingSubmitRequest) {
  const { data } = await api.post<ApiResponse<unknown>>(
    `/listing-applications/${id}/submit`,
    listingSubmitRequestSchema.parse(body),
  );
  const result = listingSubmitResultSchema.parse(data.data);
  if (result.applicationId !== id) throw new Error('신청서 제출 응답을 확인하지 못했습니다.');
  return result;
}
