import { create } from 'zustand';

import {
  EMPTY_LISTING_BASIC_INFO,
  LISTING_BASIC_INFO_PREVIEW,
} from '@/constants/listingBasicInfoPreview';
import { LISTING_TRADING_INFO_PREVIEW } from '@/constants/listingTradingInfoPreview';
import type { ListingTradingInfoForm } from '@/schemas/listingTradingInfoSchema';
import type { ListingBasicInfoForm } from '@/schemas/listingBasicInfoSchema';

type ListingDraft = {
  values: ListingBasicInfoForm;
  savedAt: string;
  tradingValues?: ListingTradingInfoForm;
  step?: 1 | 2;
};
type ListingDraftState = {
  drafts: Record<string, ListingDraft>;
  saveDraft: (id: string, values: ListingBasicInfoForm) => string;
  saveTradingDraft: (id: string, values: ListingTradingInfoForm) => string;
};

// 서버 연결 전, 화면 이동 간에만 유지하는 임시 신청서입니다.
export const useListingDraftStore = create<ListingDraftState>((set) => ({
  drafts: {
    'saas-index': {
      values: LISTING_BASIC_INFO_PREVIEW,
      savedAt: '14:30',
      tradingValues: LISTING_TRADING_INFO_PREVIEW,
    },
    'cloud-works': {
      values: { ...LISTING_BASIC_INFO_PREVIEW, serviceName: 'CloudWorks' },
      savedAt: '11:20',
    },
  },
  saveDraft: (id, values) => {
    const date = new Date();
    const savedAt = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    set((state) => ({
      drafts: { ...state.drafts, [id]: { ...state.drafts[id], values, savedAt } },
    }));
    return savedAt;
  },
  saveTradingDraft: (id, tradingValues) => {
    const date = new Date();
    const savedAt = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    set((state) => ({
      drafts: {
        ...state.drafts,
        [id]: {
          ...state.drafts[id],
          values: state.drafts[id]?.values ?? EMPTY_LISTING_BASIC_INFO,
          tradingValues,
          savedAt,
          step: 2,
        },
      },
    }));
    return savedAt;
  },
}));
