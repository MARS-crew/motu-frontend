import type { ListingEvidenceForm } from '@/schemas/listingEvidenceSchema';

export const EMPTY_LISTING_EVIDENCE: ListingEvidenceForm = {
  items: [],
  linkUrl: '',
  description: '',
};
export const LISTING_EVIDENCE_PREVIEW: ListingEvidenceForm = {
  items: [
    {
      id: 'preview-file',
      kind: 'file',
      name: 'service_data.pdf',
      uri: 'preview://service_data.pdf',
      size: Math.round(2.4 * 1024 * 1024),
      mimeType: 'application/pdf',
    },
    { id: 'preview-link', kind: 'link', url: 'https://example.com/evidence' },
  ],
  linkUrl: '',
  description: '2026년 8월 기준 매출·거래액 산정 자료입니다.',
};
