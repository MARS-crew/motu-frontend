import { Platform } from 'react-native';
import { z } from 'zod';

import { api } from '@/apis/instance';
import { listingAttachmentSchema, listingFileCollectionSchema } from '@/schemas/listingFileSchema';
import type { ListingImage } from '@/schemas/listingBasicInfoSchema';
import type { ApiResponse } from '@/types/api';
import { tokenStorage } from '@/utils/tokenStorage';

export const createListingImageCollection = async (purpose: 'LOGO' | 'MAIN_IMAGE') => {
  const { data } = await api.post<ApiResponse<unknown>>('/files/collections', { purpose });
  return listingFileCollectionSchema.parse(data.data);
};

export const getListingImageCollection = async (id: string, signal?: AbortSignal) => {
  const { data } = await api.get<ApiResponse<unknown>>(
    `/files/collections/${encodeURIComponent(id)}`,
    { signal },
  );
  return listingFileCollectionSchema.parse(data.data);
};

export const uploadListingImage = async (collectionId: string, image: ListingImage) => {
  if (image.isPreview || !image.uri) throw new Error('이미지 파일을 다시 선택해 주세요.');
  const body = new FormData();
  if (Platform.OS === 'web') {
    // 선택한 로컬 blob/data URI만 읽습니다. 서버 업로드는 공용 axios를 사용합니다.
    if (!/^(blob:|data:)/.test(image.uri)) throw new Error('이미지 파일을 다시 선택해 주세요.');
    try {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      body.append('files', blob, image.name);
    } catch {
      throw new Error('선택한 이미지 파일을 읽지 못했습니다. 다시 선택해 주세요.');
    }
  } else {
    body.append('files', {
      uri: image.uri,
      name: image.name,
      type: image.mimeType,
    } as unknown as Blob);
  }
  const { data } = await api.post<ApiResponse<unknown>>(
    `/files/collections/${encodeURIComponent(collectionId)}/uploads`,
    body,
    { timeout: 60_000 },
  );
  const attachments = z.array(listingAttachmentSchema).parse(data.data);
  if (attachments.length !== 1 || attachments[0].kind !== 'FILE')
    throw new Error('이미지 업로드 결과를 확인하지 못했습니다.');
  return attachments[0];
};

export const saveListingImageCollection = async (
  id: string,
  attachmentId: string,
  validateStep: boolean,
) => {
  const { data } = await api.put<ApiResponse<unknown>>(
    `/files/collections/${encodeURIComponent(id)}`,
    { attachmentIds: [attachmentId], validateStep },
  );
  return listingFileCollectionSchema.parse(data.data);
};

export function getListingImageUri(collectionId: string, attachmentId: string) {
  return api.getUri({
    url: `/files/collections/${encodeURIComponent(collectionId)}/attachments/${encodeURIComponent(attachmentId)}/content`,
  });
}

export async function getListingImageSource(image: ListingImage) {
  if (!image.collectionId || !image.attachmentId) return { uri: image.uri };
  const token = await tokenStorage.getAccessToken();
  return {
    uri: getListingImageUri(image.collectionId, image.attachmentId),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };
}
