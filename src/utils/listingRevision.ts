import { isAxiosError } from 'axios';
import { ZodError } from 'zod';

import type { ListingApplicationDetail } from '@/schemas/listingApplicationDetailSchema';
import type { ListingFileCollection } from '@/schemas/listingFileSchema';
import type { ListingRevision } from '@/schemas/listingRevisionSchema';
import type { ListingEvidenceForm } from '@/schemas/listingEvidenceSchema';

export function canResubmitListing(
  application: ListingApplicationDetail,
  revision: ListingRevision,
  now = Date.now(),
) {
  return (
    application.status === 'REVISION_REQUESTED' &&
    revision.canResubmit &&
    !revision.isDeadlinePassed &&
    !revision.resubmittedAt &&
    Date.parse(revision.deadline) > now
  );
}
export function assertListingRevisionEditable(
  context: { application: ListingApplicationDetail; revision: ListingRevision },
  revisionId: number,
) {
  if (context.revision.id !== revisionId)
    throw new Error('보완 요청이 변경되었습니다. 신청 상세에서 다시 열어 주세요.');
  if (!canResubmitListing(context.application, context.revision))
    throw new Error('보완 기한이 지났거나 현재 재제출할 수 없는 상태입니다.');
}
export function toListingRevisionEvidence(
  collection: ListingFileCollection | null,
): ListingEvidenceForm {
  return {
    items:
      collection?.attachments
        .filter((item) => item.saved)
        .map((item) =>
          item.kind === 'LINK'
            ? { id: item.id, kind: 'link' as const, url: item.url ?? '' }
            : {
                id: item.id,
                kind: 'file' as const,
                name: item.originalName ?? '',
                uri: `listing-evidence:${encodeURIComponent(collection.id)}/${encodeURIComponent(item.id)}`,
                size: item.size ?? 0,
                mimeType: item.contentType ?? '',
              },
        ) ?? [],
    description: collection?.description ?? '',
    linkUrl: '',
  };
}

export function getListingRevisionError(error: unknown) {
  if (isAxiosError(error))
    return typeof error.response?.data?.error?.message === 'string'
      ? error.response.data.error.message
      : '요청을 처리하지 못했습니다. 입력 내용은 유지됩니다. 다시 시도해 주세요.';
  if (error instanceof ZodError)
    return error.issues.some((issue) => /[가-힣]/.test(issue.message))
      ? error.issues
          .filter((issue) => /[가-힣]/.test(issue.message))
          .map((issue) => issue.message)
          .join('\n')
      : '서버 응답을 확인하지 못했습니다. 다시 조회해 주세요.';
  return error instanceof Error ? error.message : '요청을 처리하지 못했습니다. 다시 시도해 주세요.';
}
