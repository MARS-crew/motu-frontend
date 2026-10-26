import { api } from '@/apis/instance';
import { listingDraftListSchema } from '@/schemas/listingDraftSchema';
import type { ApiResponse } from '@/types/api';

export const getListingDrafts = async (limit: 2 | 5, signal?: AbortSignal) => {
  const { data } = await api.get<ApiResponse<unknown>>('/listing-applications/drafts', {
    params: { limit },
    signal,
  });
  return listingDraftListSchema.parse(data.data);
};
