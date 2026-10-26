import { LISTING_DRAFT_STEP_LABELS } from '@/constants/listingApplicationsPreview';
import type { ListingDraftSummary } from '@/schemas/listingDraftSchema';
import type { ListingApplicationListItem } from '@/types/listingApplication';
import { formatListingDate } from '@/utils/listingApplication';

export function getListingDraftStep(step: number): 1 | 2 | 3 | 4 {
  return step === 4 ? 4 : step === 3 ? 3 : step === 2 ? 2 : 1;
}

export function toListingDraftSummaryItem(draft: ListingDraftSummary) {
  const date = new Date(draft.lastSavedAt);
  const step = getListingDraftStep(draft.currentStep);
  return {
    id: String(draft.id),
    name: draft.serviceName?.trim() || '제목 없는 신청서',
    step: LISTING_DRAFT_STEP_LABELS[step - 1],
    progress: `${step}/4`,
    savedAt: `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
  };
}

export function toListingDraftListItem(draft: ListingDraftSummary): ListingApplicationListItem {
  return {
    id: String(draft.id),
    name: draft.serviceName?.trim() || '제목 없는 신청서',
    status: 'draft',
    savedDate: formatListingDate(new Date(draft.lastSavedAt)),
    step: getListingDraftStep(draft.currentStep),
  };
}
