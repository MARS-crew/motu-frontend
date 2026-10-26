import { api } from '@/apis/instance';
import { listingApplicationDetailSchema } from '@/schemas/listingApplicationDetailSchema';
import type { ApiResponse } from '@/types/api';

export async function getListingApplicationDetail(id: number, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<unknown>>(`/listing-applications/${id}`, { signal });
  return listingApplicationDetailSchema.parse(data.data);
}
