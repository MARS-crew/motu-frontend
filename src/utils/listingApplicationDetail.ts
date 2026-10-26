import { LISTING_DRAFT_STEP_LABELS } from '@/constants/listingApplicationsPreview';
import type { ListingApplicationDetail } from '@/schemas/listingApplicationDetailSchema';
import type { ListingApplicationStatus } from '@/types/listingApplication';

export const LISTING_DETAIL_STATUSES: Record<
  ListingApplicationDetail['status'],
  ListingApplicationStatus | 'expired'
> = {
  DRAFT: 'draft',
  SUBMITTED: 'received',
  UNDER_REVIEW: 'reviewing',
  REVISION_REQUESTED: 'supplementRequested',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
};

export function formatListingDetailDate(value: string | null, hasTime = true) {
  if (!value) return '-';
  const kst = new Date(Date.parse(value) + 9 * 60 * 60 * 1000).toISOString();
  const date = kst.slice(0, 10).replaceAll('-', '.');
  return hasTime ? `${date} ${kst.slice(11, 16)}` : date;
}

export function getListingDetailEvidence(application: ListingApplicationDetail) {
  const files = application.attachments.evidence?.attachments.filter((item) => item.saved) ?? [];
  if (!files.length) return '등록된 자료 없음';
  const first = files.find((item) => item.kind === 'FILE') ?? files[0];
  const name = first.originalName || (first.kind === 'LINK' ? '외부 링크' : '증빙 파일');
  return files.length > 1 ? `${name} 외 ${files.length - 1}개` : name;
}

export function getListingDetailRows(application: ListingApplicationDetail) {
  if (application.status === 'DRAFT')
    return [
      { label: '최근 저장일시', value: formatListingDetailDate(application.lastSavedAt) },
      {
        label: '작성 단계',
        value: `${LISTING_DRAFT_STEP_LABELS[application.currentStep - 1]} ${application.currentStep}/4`,
      },
      { label: '증빙 파일', value: getListingDetailEvidence(application) },
    ];
  if (application.status === 'REVISION_REQUESTED')
    return [
      { label: '신청일', value: formatListingDetailDate(application.submittedAt, false) },
      { label: '보완기한', value: formatListingDetailDate(application.revisionDeadline, false) },
    ];
  return [
    { label: '제출일시', value: formatListingDetailDate(application.submittedAt) },
    ...(application.applicationNumber
      ? [{ label: '신청번호', value: application.applicationNumber }]
      : []),
    { label: '증빙 파일', value: getListingDetailEvidence(application) },
  ];
}
