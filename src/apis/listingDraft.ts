import { api } from '@/apis/instance';
import {
  listingDraftListSchema,
  listingDraftDetailSchema,
  listingBasicStepResultSchema,
  type SaveListingBasicDraft,
} from '@/schemas/listingDraftSchema';
import type { ApiResponse } from '@/types/api';

export const getListingDrafts = async (limit: 2 | 5, signal?: AbortSignal) => {
  const { data } = await api.get<ApiResponse<unknown>>('/listing-applications/drafts', {
    params: { limit },
    signal,
  });
  return listingDraftListSchema.parse(data.data);
};

export const getListingDraftDetail = async (id: number, signal?: AbortSignal) => {
  const { data } = await api.get<ApiResponse<unknown>>(`/listing-applications/drafts/${id}`, {
    signal,
  });
  return listingDraftDetailSchema.parse(data.data);
};

export const createListingDraft = async () => {
  const { data } = await api.post<ApiResponse<unknown>>('/listing-applications/drafts', {});
  return listingDraftDetailSchema.parse(data.data);
};

export const saveListingBasicDraft = async (id: number, body: SaveListingBasicDraft) => {
  const { data } = await api.patch<ApiResponse<unknown>>(
    `/listing-applications/drafts/${id}`,
    body,
  );
  return listingDraftDetailSchema.parse(data.data);
};

export const validateListingBasicStep = async (id: number, body: SaveListingBasicDraft) => {
  const { data } = await api.put<ApiResponse<unknown>>(
    `/listing-applications/drafts/${id}/steps/1`,
    { data: body.data },
  );
  return listingBasicStepResultSchema.parse(data.data);
};
