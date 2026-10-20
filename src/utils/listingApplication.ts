import type { EvidenceItem } from '@/schemas/listingEvidenceSchema';

export function formatListingDate(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export function getListingDraftRoute(step = 1) {
  switch (step) {
    case 4:
      return '/listing-application/evidence' as const;
    case 3:
      return '/listing-application/service-metrics' as const;
    case 2:
      return '/listing-application/trading-info' as const;
    default:
      return '/listing-application/basic-info' as const;
  }
}

export function getListingEvidenceSummary(items: EvidenceItem[]) {
  const firstItem = items.find((item) => item.kind === 'file') ?? items[0];
  if (!firstItem) return '등록된 자료 없음';
  const name = firstItem.kind === 'file' ? firstItem.name : firstItem.url;
  return items.length > 1 ? `${name} 외 ${items.length - 1}개` : name;
}
