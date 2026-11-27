import { api, SessionChangedError } from '@/apis/instance';
import { tokenStorage } from '@/utils/tokenStorage';
import {
  listingDraftListSchema,
  listingDraftDetailSchema,
  listingBasicStepResultSchema,
  type SaveListingBasicDraft,
  type SaveListingTradingDraft,
  listingTradingStepResultSchema,
  listingMetricsStepResultSchema,
  type SaveListingMetricsDraft,
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

export const saveListingTradingDraft = async (id: number, body: SaveListingTradingDraft) => {
  const { data } = await api.patch<ApiResponse<unknown>>(
    `/listing-applications/drafts/${id}`,
    body,
  );
  return listingDraftDetailSchema.parse(data.data);
};

export const validateListingTradingStep = async (id: number, body: SaveListingTradingDraft) => {
  const { data } = await api.put<ApiResponse<unknown>>(
    `/listing-applications/drafts/${id}/steps/2`,
    { data: body.data },
  );
  return listingTradingStepResultSchema.parse(data.data);
};

export const saveListingMetricsDraft = async (id: number, body: SaveListingMetricsDraft) => {
  const { data } = await api.patch<ApiResponse<unknown>>(
    `/listing-applications/drafts/${id}`,
    body,
  );
  return listingDraftDetailSchema.parse(data.data);
};

export const validateListingMetricsStep = async (id: number, body: SaveListingMetricsDraft) => {
  const { data } = await api.put<ApiResponse<unknown>>(
    `/listing-applications/drafts/${id}/steps/3`,
    { data: body.data },
  );
  return listingMetricsStepResultSchema.parse(data.data);
};

export async function saveListingEvidenceStep(
  id: number,
  collectionId: string,
  description: string,
) {
  const session = tokenStorage.getSessionId();
  const body = { data: { evidenceCollectionId: collectionId, evidenceDescription: description } };
  await api.patch(`/listing-applications/drafts/${id}`, { currentStep: 4, ...body });
  if (session !== tokenStorage.getSessionId()) throw new SessionChangedError();
  const { data } = await api.put<ApiResponse<unknown>>(
    `/listing-applications/drafts/${id}/steps/4`,
    body,
  );
  return listingDraftDetailSchema.parse(data.data);
}
