import { useMutation, useQueryClient } from '@tanstack/react-query';

import { saveListingTradingDraft, validateListingTradingStep } from '@/apis/listingDraft';
import { listingBasicDraftKey } from '@/queries/useListingBasicDraftQuery';
import { LISTING_DRAFTS_QUERY_KEY } from '@/queries/useListingDraftsQuery';
import { listingTradingDraftKey } from '@/queries/useListingTradingDraftQuery';
import { saveListingTradingDraftSchema } from '@/schemas/listingDraftSchema';
import {
  listingTradingInfoSchema,
  type ListingTradingInfoForm,
} from '@/schemas/listingTradingInfoSchema';
import { toListingTradingDraftData } from '@/utils/listingTradingDraft';

type SaveListingTradingDraftVariables = {
  id: number;
  values: ListingTradingInfoForm;
  validateStep: boolean;
};

export function useSaveListingTradingDraftMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async ({ id, values, validateStep }: SaveListingTradingDraftVariables) => {
      if (!Number.isSafeInteger(id) || id <= 0) throw new Error('올바른 신청서 번호가 아닙니다.');
      if (validateStep) listingTradingInfoSchema.parse(values);
      const body = saveListingTradingDraftSchema.parse({
        currentStep: 2,
        data: toListingTradingDraftData(values),
      });
      const draft = validateStep
        ? await validateListingTradingStep(id, body)
        : await saveListingTradingDraft(id, body);
      return { draft, values };
    },
    onSuccess: async ({ draft }) => {
      await queryClient.cancelQueries({ queryKey: listingTradingDraftKey(draft.id) });
      queryClient.setQueryData(listingTradingDraftKey(draft.id), draft);
      void queryClient.invalidateQueries({ queryKey: listingBasicDraftKey(draft.id) });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: LISTING_DRAFTS_QUERY_KEY });
    },
  });
}
