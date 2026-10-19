import { z } from 'zod';

import { listingBasicInfoSchema } from '@/schemas/listingBasicInfoSchema';
import { listingEvidenceSchema } from '@/schemas/listingEvidenceSchema';
import { listingMetricsSchema } from '@/schemas/listingMetricsSchema';
import { listingTradingInfoSchema } from '@/schemas/listingTradingInfoSchema';

// 기존 단계별 스키마를 재사용해 최종 확인에서도 동일한 조건으로 검증합니다.
export const listingSubmissionSchema = z.object({
  values: listingBasicInfoSchema,
  tradingValues: listingTradingInfoSchema,
  metricsValues: listingMetricsSchema,
  evidenceValues: listingEvidenceSchema,
});

export type ListingSubmissionForm = z.infer<typeof listingSubmissionSchema>;
