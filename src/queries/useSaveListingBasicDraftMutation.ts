import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';

import {
  createListingDraft,
  saveListingBasicDraft,
  validateListingBasicStep,
} from '@/apis/listingDraft';
import {
  createListingImageCollection,
  getListingImageCollection,
  uploadListingImage,
  saveListingImageCollection,
} from '@/apis/listingFile';
import { getSectors } from '@/apis/sector';
import {
  listingImageSchema,
  type ListingBasicInfoForm,
  type ListingImage,
} from '@/schemas/listingBasicInfoSchema';
import { saveListingBasicDraftSchema } from '@/schemas/listingDraftSchema';
import type { ListingFileCollection } from '@/schemas/listingFileSchema';
import { listingBasicDraftKey } from '@/queries/useListingBasicDraftQuery';
import { LISTING_DRAFTS_QUERY_KEY } from '@/queries/useListingDraftsQuery';
import { toListingBasicDraftData } from '@/utils/listingBasicDraft';
import {
  getListingBasicInfoError,
  getListingBasicInfoField,
  ListingBasicInfoSaveError,
} from '@/utils/listingBasicInfoError';

type SaveListingBasicDraftVariables = {
  id: number | null;
  values: ListingBasicInfoForm;
  validateStep: boolean;
};
type UseSaveListingBasicDraftMutationOptions = {
  onCreated: (id: number) => void;
  onImageUploaded: (field: 'logo' | 'coverImage', image: ListingImage) => void;
};

export function useSaveListingBasicDraftMutation({
  onCreated,
  onImageUploaded,
}: UseSaveListingBasicDraftMutationOptions) {
  const queryClient = useQueryClient();
  const [hasUnknownCreation, setHasUnknownCreation] = useState(false);
  const mutation = useMutation({
    retry: false,
    mutationFn: async ({ id, values: input, validateStep }: SaveListingBasicDraftVariables) => {
      const values = {
        ...input,
        logo: input.logo ? { ...input.logo } : null,
        coverImage: input.coverImage ? { ...input.coverImage } : null,
      };
      for (const field of ['logo', 'coverImage'] as const) {
        const image = values[field];
        if (image) {
          const parsed = listingImageSchema.safeParse(image);
          if (!parsed.success)
            throw new ListingBasicInfoSaveError(parsed.error.issues[0].message, field);
        }
      }
      const sectors = values.category
        ? await queryClient.fetchQuery({
            queryKey: ['sectors'],
            queryFn: getSectors,
            staleTime: Infinity,
          })
        : [];
      if (values.category && !sectors.some((sector) => sector.sectorName === values.category))
        throw new ListingBasicInfoSaveError(
          '카테고리 정보를 확인하지 못했습니다. 다시 선택해 주세요.',
          'category',
        );
      const parsed = saveListingBasicDraftSchema.safeParse({
        currentStep: 1,
        data: toListingBasicDraftData(values, sectors),
      });
      if (!parsed.success) {
        const issue = parsed.error.issues[0];
        throw new ListingBasicInfoSaveError(
          '입력값의 최대 길이를 확인해 주세요.',
          getListingBasicInfoField(String(issue.path.at(-1))),
        );
      }
      let draftId = id;
      if (draftId === null) {
        if (hasUnknownCreation)
          throw new ListingBasicInfoSaveError(
            '저장 결과를 확인하지 못했습니다. 작성 중 신청서 목록에서 확인한 뒤 다시 열어 주세요.',
          );
        try {
          const created = await createListingDraft();
          draftId = created.id;
          onCreated(created.id);
        } catch (error: unknown) {
          if (!isAxiosError(error) || !error.response) {
            setHasUnknownCreation(true);
            throw new ListingBasicInfoSaveError(
              '저장 결과를 확인하지 못했습니다. 작성 중 신청서 목록에서 확인한 뒤 다시 열어 주세요.',
            );
          }
          throw error;
        }
      }
      const collections: {
        logo: ListingFileCollection | null;
        cover: ListingFileCollection | null;
      } = { logo: null, cover: null };
      for (const field of ['logo', 'coverImage'] as const) {
        let image = values[field];
        if (!image) continue;
        try {
          const hadCollection = Boolean(image.collectionId);
          if (!image.collectionId) {
            const collection = await createListingImageCollection(
              field === 'logo' ? 'LOGO' : 'MAIN_IMAGE',
            );
            image = { ...image, collectionId: collection.id };
            onImageUploaded(field, image);
          }
          const collectionId = image.collectionId;
          if (!collectionId) throw new Error('이미지 작성 묶음을 확인하지 못했습니다.');
          if (!image.attachmentId && hadCollection) {
            const collection = await getListingImageCollection(collectionId);
            const completed = collection.attachments.find(
              (attachment) =>
                attachment.kind === 'FILE' &&
                attachment.originalName === image?.name &&
                attachment.size === image?.size,
            );
            if (completed) {
              image = { ...image, attachmentId: completed.id };
              onImageUploaded(field, image);
            } else if (collection.attachments.length > 0) {
              throw new Error('이미지 저장 상태가 변경되었습니다. 파일을 다시 선택해 주세요.');
            }
          }
          if (!image.attachmentId) {
            const attachment = await uploadListingImage(collectionId, image);
            image = { ...image, attachmentId: attachment.id };
            onImageUploaded(field, image);
          }
          if (!image.attachmentId) throw new Error('이미지 업로드 결과를 확인하지 못했습니다.');
          const selectedAttachmentId = image.attachmentId;
          const collection = await saveListingImageCollection(
            collectionId,
            image.attachmentId,
            validateStep,
          );
          if (
            !collection.attachments.some(
              (attachment) => attachment.id === selectedAttachmentId && attachment.saved,
            )
          )
            throw new Error('이미지 저장 결과를 확인하지 못했습니다.');
          collections[field === 'logo' ? 'logo' : 'cover'] = collection;
          values[field] = image;
        } catch (error: unknown) {
          const message = isAxiosError(error)
            ? getListingBasicInfoError(error).message
            : error instanceof Error
              ? error.message
              : '이미지를 저장하지 못했습니다.';
          throw new ListingBasicInfoSaveError(message, field);
        }
      }
      const body = saveListingBasicDraftSchema.parse({
        currentStep: 1,
        data: toListingBasicDraftData(values, sectors),
      });
      const draft = validateStep
        ? await validateListingBasicStep(draftId, body)
        : await saveListingBasicDraft(draftId, body);
      return { draft, values, ...collections };
    },
    onSuccess: async ({ draft, logo, cover }) => {
      await queryClient.cancelQueries({ queryKey: listingBasicDraftKey(draft.id) });
      queryClient.setQueryData(listingBasicDraftKey(draft.id), { draft, logo, cover });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: LISTING_DRAFTS_QUERY_KEY });
    },
  });
  return { ...mutation, hasUnknownCreation };
}
