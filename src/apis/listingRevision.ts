import { api } from '@/apis/instance';
import { getListingApplicationDetail } from '@/apis/listingApplication';
import {
  listingRevisionsSchema,
  listingResubmitRequestSchema,
  listingResubmitResultSchema,
  type ListingResubmitRequest,
} from '@/schemas/listingRevisionSchema';
import type { ApiResponse } from '@/types/api';

export async function getListingRevisions(applicationId: number, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<unknown>>(
    `/listing-applications/${applicationId}/revision-requests`,
    { params: { page: 1, size: 1 }, signal },
  );
  return listingRevisionsSchema.parse(data.data);
}
export async function getListingRevisionContext(applicationId: number, signal?: AbortSignal) {
  const [application, history] = await Promise.all([
    getListingApplicationDetail(applicationId, signal),
    getListingRevisions(applicationId, signal),
  ]);
  if (application.id !== applicationId || history.applicationId !== applicationId)
    throw new Error('신청서 정보를 확인하지 못했습니다.');
  const revision = history.items[0];
  if (!revision) throw new Error('보완 요청을 찾을 수 없습니다.');
  return { application, revision };
}
export async function resubmitListingRevision(
  applicationId: number,
  revisionId: number,
  body: ListingResubmitRequest,
) {
  const { data } = await api.post<ApiResponse<unknown>>(
    `/listing-applications/${applicationId}/revision-requests/${revisionId}/resubmit`,
    listingResubmitRequestSchema.parse(body),
  );
  const result = listingResubmitResultSchema.parse(data.data);
  if (
    result.applicationId !== applicationId ||
    result.revision.id !== revisionId ||
    !result.revision.resubmittedAt
  )
    throw new Error('재제출 결과를 확인하지 못했습니다. 이력을 다시 조회해 주세요.');
  return result;
}
