import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { saveListingEvidenceStep } from '@/apis/listingDraft';
import { SessionChangedError } from '@/apis/instance';
import { tokenStorage } from '@/utils/tokenStorage';

import { getListingImageCollection } from '@/apis/listingFile';
import {
  createListingRevisionEvidence,
  addListingRevisionLink,
  uploadListingRevisionEvidence,
  saveListingRevisionEvidence,
} from '@/apis/listingRevisionEvidence';
import { listingEvidenceSchema, type ListingEvidenceForm } from '@/schemas/listingEvidenceSchema';

type Attempt = {
  key: string;
  collectionId?: string;
  ids: Record<string, string>;
  unknown?: { itemId: string; before: string[] };
};

export function useSaveListingEvidenceMutation(applicationId: number) {
  const queryClient = useQueryClient();
  const attempt = useRef<Attempt | null>(null);
  return useMutation({
    retry: false,
    mutationFn: async (input: ListingEvidenceForm) => {
      const session = tokenStorage.getSessionId();
      const assertSession = () => {
        if (session !== tokenStorage.getSessionId()) throw new SessionChangedError();
      };
      const values = listingEvidenceSchema.parse(input);
      if (!Number.isSafeInteger(applicationId) || applicationId <= 0)
        throw new Error('올바른 신청서 번호가 아닙니다.');
      if (!values.items.length) throw new Error('증빙 자료가 필요합니다.');
      if (values.linkUrl.trim()) throw new Error('입력한 외부 링크의 추가 버튼을 눌러 주세요.');
      if (values.items.some((item) => item.kind === 'link' && !item.url.startsWith('https://')))
        throw new Error('외부 링크는 HTTPS 주소로 입력해 주세요.');
      assertSession();
      const key = JSON.stringify({ session, applicationId, values });
      if (attempt.current?.key !== key) attempt.current = { key, ids: {} };
      const progress = attempt.current;
      if (!progress.collectionId)
        progress.collectionId = (await createListingRevisionEvidence()).id;
      assertSession();
      const collectionId = progress.collectionId;
      if (progress.unknown) {
        assertSession();
        const current = await getListingImageCollection(collectionId);
        assertSession();
        const added = current.attachments.filter(
          (item) => !progress.unknown?.before.includes(item.id),
        );
        if (added.length === 1) progress.ids[progress.unknown.itemId] = added[0].id;
        else if (added.length > 1)
          throw new Error('파일 저장 결과를 확인하지 못했습니다. 자료를 다시 선택해 주세요.');
        progress.unknown = undefined;
      }
      for (const item of values.items) {
        if (progress.ids[item.id]) continue;
        assertSession();
        const current = await getListingImageCollection(collectionId);
        assertSession();
        progress.unknown = { itemId: item.id, before: current.attachments.map((item) => item.id) };
        const attachment =
          item.kind === 'link'
            ? await addListingRevisionLink(collectionId, item.url)
            : await uploadListingRevisionEvidence(collectionId, item);
        progress.ids[item.id] = attachment.id;
        progress.unknown = undefined;
      }
      assertSession();
      const collection = await saveListingRevisionEvidence(
        collectionId,
        values.items.map((item) => progress.ids[item.id]),
        values.description,
      );
      assertSession();
      const result = await saveListingEvidenceStep(
        applicationId,
        collection.id,
        values.description,
      );
      assertSession();
      return result;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['listing-applications'] });
    },
  });
}
