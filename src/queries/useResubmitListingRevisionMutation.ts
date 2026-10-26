import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getListingRevisionContext, resubmitListingRevision } from '@/apis/listingRevision';
import { getListingImageCollection } from '@/apis/listingFile';
import { listingEvidenceSchema } from '@/schemas/listingEvidenceSchema';
import { assertListingRevisionEditable, toListingRevisionEvidence } from '@/utils/listingRevision';

export function useResubmitListingRevisionMutation(applicationId: number, revisionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async (collectionId: string) => {
      const context = await getListingRevisionContext(applicationId);
      if (context.revision.id !== revisionId)
        throw new Error('보완 요청이 변경되었습니다. 다시 확인해 주세요.');
      // 응답 유실 후 재시도는 이미 제출한 동일 자료만 허용합니다.
      if (context.revision.resubmittedAt) {
        if (context.revision.evidenceCollectionId !== collectionId)
          throw new Error('이미 다른 자료로 재제출되었습니다. 신청 상세를 확인해 주세요.');
      } else assertListingRevisionEditable(context, revisionId);
      const evidence = await getListingImageCollection(collectionId);
      if (evidence.purpose !== 'EVIDENCE') throw new Error('증빙 자료 묶음이 아닙니다.');
      listingEvidenceSchema.parse(toListingRevisionEvidence(evidence));
      return resubmitListingRevision(applicationId, revisionId, {
        evidenceCollectionId: collectionId,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['listing-applications'] });
    },
  });
}
