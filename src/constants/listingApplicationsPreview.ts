import { LISTING_EVIDENCE_PREVIEW } from '@/constants/listingEvidencePreview';

import type {
  ListingApplicationFilter,
  ListingSubmittedApplication,
} from '@/types/listingApplication';

export const LISTING_APPLICATION_FILTERS: { value: ListingApplicationFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'draft', label: '임시 저장' },
  { value: 'received', label: '접수' },
  { value: 'reviewing', label: '검토중' },
  { value: 'supplementRequested', label: '보완 요청' },
  { value: 'approved', label: '승인' },
  { value: 'rejected', label: '반려' },
];

export const LISTING_DRAFT_STEP_LABELS = [
  '기본 정보',
  '평가·거래',
  '서비스 지표',
  '증빙 자료',
] as const;

// 서버 연결 전, 내 상장 신청 목록의 상태를 확인하기 위한 예시 데이터입니다.
export const LISTING_SUBMITTED_APPLICATIONS_PREVIEW: Record<string, ListingSubmittedApplication> = {
  'saas-index-received': {
    id: 'saas-index-received',
    name: 'SaaS Index',
    status: 'received',
    submittedDate: '2026.08.31',
    submittedAt: '2026.08.31 22:30',
    evidenceItems: LISTING_EVIDENCE_PREVIEW.items,
  },
  'creator-index': {
    id: 'creator-index',
    name: 'Creator Index',
    status: 'supplementRequested',
    submittedDate: '2026.08.30',
  },
  'local-commerce': {
    id: 'local-commerce',
    name: 'Local Commerce',
    status: 'approved',
    submittedDate: '2026.08.21',
  },
};
