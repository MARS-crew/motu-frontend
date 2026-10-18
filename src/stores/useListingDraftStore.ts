import { create } from 'zustand';

import { LISTING_BASIC_INFO_PREVIEW } from '@/constants/listingBasicInfoPreview';
import type { ListingBasicInfoForm } from '@/schemas/listingBasicInfoSchema';

type ListingDraft = { values: ListingBasicInfoForm; savedAt: string };
type ListingDraftState = {
  drafts: Record<string, ListingDraft>;
  saveDraft: (id: string, values: ListingBasicInfoForm) => string;
};

// 서버 연결 전, 화면 이동 간에만 유지하는 임시 신청서입니다.
export const useListingDraftStore = create<ListingDraftState>((set) => ({
  drafts: {
    'saas-index': { values: LISTING_BASIC_INFO_PREVIEW, savedAt: '14:30' },
    'cloud-works': {
      values: { ...LISTING_BASIC_INFO_PREVIEW, serviceName: 'CloudWorks' },
      savedAt: '11:20',
    },
  },
  saveDraft: (id, values) => {
    const date = new Date();
    const savedAt = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    set((state) => ({ drafts: { ...state.drafts, [id]: { values, savedAt } } }));
    return savedAt;
  },
}));
