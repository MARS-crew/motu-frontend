import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getListingDraftDetail,
  saveListingMetricsDraft,
  validateListingMetricsStep,
} from '@/apis/listingDraft';
import { listingTradingDraftKey } from '@/queries/useListingTradingDraftQuery';
import { listingBasicDraftKey } from '@/queries/useListingBasicDraftQuery';
import { LISTING_DRAFTS_QUERY_KEY } from '@/queries/useListingDraftsQuery';
import { listingMetricsDraftKey } from '@/queries/useListingMetricsDraftQuery';
import { saveListingMetricsDraftSchema } from '@/schemas/listingDraftSchema';
import { listingMetricsSchema, type ListingMetricsForm } from '@/schemas/listingMetricsSchema';
import { toListingMetricsDraftData } from '@/utils/listingMetricsDraft';

type SaveListingMetricsDraftVariables = {
  id: number;
  values: ListingMetricsForm;
  validateStep: boolean;
};

export function useSaveListingMetricsDraftMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async ({ id, values, validateStep }: SaveListingMetricsDraftVariables) => {
      if (!Number.isSafeInteger(id) || id <= 0) throw new Error('올바른 신청서 번호가 아닙니다.');
      if (validateStep) listingMetricsSchema.parse(values);
      const savedData =
        values.transactionBasis === 'entireOperation'
          ? (await getListingDraftDetail(id)).data
          : undefined;
      const body = saveListingMetricsDraftSchema.parse({
        currentStep: 3,
        data: toListingMetricsDraftData(values, { savedData }),
      });
      const draft = validateStep
        ? await validateListingMetricsStep(id, body)
        : await saveListingMetricsDraft(id, body);
      return { draft, values };
    },
    onSuccess: async ({ draft }) => {
      await queryClient.cancelQueries({ queryKey: listingMetricsDraftKey(draft.id) });
      queryClient.setQueryData(listingMetricsDraftKey(draft.id), draft);
      void queryClient.invalidateQueries({ queryKey: listingBasicDraftKey(draft.id) });
      void queryClient.invalidateQueries({ queryKey: listingTradingDraftKey(draft.id) });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: LISTING_DRAFTS_QUERY_KEY });
    },
  });
}
