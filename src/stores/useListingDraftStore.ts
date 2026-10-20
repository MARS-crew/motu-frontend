import { create } from 'zustand';

import {
  EMPTY_LISTING_BASIC_INFO,
  LISTING_BASIC_INFO_PREVIEW,
} from '@/constants/listingBasicInfoPreview';
import { LISTING_EVIDENCE_PREVIEW } from '@/constants/listingEvidencePreview';
import type { ListingEvidenceForm } from '@/schemas/listingEvidenceSchema';
import { LISTING_METRICS_PREVIEW } from '@/constants/listingMetricsPreview';
import type { ListingMetricsForm } from '@/schemas/listingMetricsSchema';
import { LISTING_TRADING_INFO_PREVIEW } from '@/constants/listingTradingInfoPreview';
import { LISTING_SUBMITTED_APPLICATIONS_PREVIEW } from '@/constants/listingApplicationsPreview';
import { LISTING_RECEIPT_NUMBER_PREVIEW } from '@/constants/listingSubmissionPreview';
import { listingSubmissionSchema } from '@/schemas/listingSubmissionSchema';
import type { ListingSubmittedApplication } from '@/types/listingApplication';
import { formatListingDate } from '@/utils/listingApplication';
import type { ListingTradingInfoForm } from '@/schemas/listingTradingInfoSchema';
import type { ListingBasicInfoForm } from '@/schemas/listingBasicInfoSchema';

type ListingDraft = {
  values: ListingBasicInfoForm;
  savedAt: string;
  savedDate?: string;
  tradingValues?: ListingTradingInfoForm;
  metricsValues?: ListingMetricsForm;
  evidenceValues?: ListingEvidenceForm;
  step?: 1 | 2 | 3 | 4;
};
type ListingDraftState = {
  drafts: Record<string, ListingDraft>;
  applications: Record<string, ListingSubmittedApplication>;
  deleteDraft: (id: string) => void;
  submitDraftPreview: (id: string) => boolean;
  saveDraft: (id: string, values: ListingBasicInfoForm) => string;
  saveEvidenceDraft: (id: string, values: ListingEvidenceForm) => string;
  saveMetricsDraft: (id: string, values: ListingMetricsForm) => string;
  saveTradingDraft: (id: string, values: ListingTradingInfoForm) => string;
};

// 서버 연결 전, 화면 이동 간에만 유지하는 임시 신청서입니다.
export const useListingDraftStore = create<ListingDraftState>((set, get) => ({
  applications: LISTING_SUBMITTED_APPLICATIONS_PREVIEW,
  drafts: {
    'saas-index': {
      values: LISTING_BASIC_INFO_PREVIEW,
      savedAt: '14:30',
      savedDate: '2026.09.19',
      step: 2,
      tradingValues: LISTING_TRADING_INFO_PREVIEW,
      metricsValues: LISTING_METRICS_PREVIEW,
      evidenceValues: LISTING_EVIDENCE_PREVIEW,
    },
    'cloud-works': {
      values: { ...LISTING_BASIC_INFO_PREVIEW, serviceName: 'CloudWorks' },
      savedAt: '11:20',
      savedDate: '2026.09.18',
    },
  },
  deleteDraft: (id) => {
    set((state) => {
      if (state.applications[id]) return state;
      const drafts = { ...state.drafts };
      delete drafts[id];
      return { drafts };
    });
  },
  // 서버 연결 전 목록의 접수 상태를 재현하는 클라이언트 상태입니다.
  submitDraftPreview: (id) => {
    const state = get();
    if (state.applications[id]) return true;
    const draft = state.drafts[id];
    if (!listingSubmissionSchema.safeParse(draft).success) return false;
    const date = new Date();
    const submittedDate = formatListingDate(date);
    const submittedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    set({
      applications: {
        ...state.applications,
        [id]: {
          id,
          name: draft.values.serviceName,
          status: 'received',
          submittedDate,
          submittedAt: `${submittedDate} ${submittedTime}`,
          evidenceItems: draft.evidenceValues?.items.map((item) => ({ ...item })) ?? [],
          receiptNumber: LISTING_RECEIPT_NUMBER_PREVIEW,
        },
      },
    });
    return true;
  },
  saveDraft: (id, values) => {
    const date = new Date();
    const savedAt = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    set((state) => ({
      drafts: {
        ...state.drafts,
        [id]: { ...state.drafts[id], values, savedAt, savedDate: formatListingDate(date) },
      },
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
          savedDate: formatListingDate(date),
          step: 2,
        },
      },
    }));
    return savedAt;
  },
  saveMetricsDraft: (id, metricsValues) => {
    const date = new Date();
    const savedAt = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    set((state) => ({
      drafts: {
        ...state.drafts,
        [id]: {
          ...state.drafts[id],
          values: state.drafts[id]?.values ?? EMPTY_LISTING_BASIC_INFO,
          metricsValues,
          savedAt,
          savedDate: formatListingDate(date),
          step: 3,
        },
      },
    }));
    return savedAt;
  },
  saveEvidenceDraft: (id, evidenceValues) => {
    const date = new Date();
    const savedAt = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    set((state) => ({
      drafts: {
        ...state.drafts,
        [id]: {
          ...state.drafts[id],
          values: state.drafts[id]?.values ?? EMPTY_LISTING_BASIC_INFO,
          evidenceValues,
          savedAt,
          savedDate: formatListingDate(date),
          step: 4,
        },
      },
    }));
    return savedAt;
  },
}));
