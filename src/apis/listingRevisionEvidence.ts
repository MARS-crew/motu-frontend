import { Platform } from 'react-native';
import { z } from 'zod';

import { api } from '@/apis/instance';
import { listingAttachmentSchema, listingFileCollectionSchema } from '@/schemas/listingFileSchema';
import type { EvidenceItem } from '@/schemas/listingEvidenceSchema';
import type { ApiResponse } from '@/types/api';

const collectionPath = (id: string) => `/files/collections/${encodeURIComponent(id)}`;

export async function createListingRevisionEvidence() {
  const { data } = await api.post<ApiResponse<unknown>>('/files/collections', {
    purpose: 'EVIDENCE',
  });
  return listingFileCollectionSchema.parse(data.data);
}
export async function addListingRevisionLink(id: string, url: string) {
  if (!url.startsWith('https://')) throw new Error('외부 링크는 HTTPS 주소로 입력해 주세요.');
  const { data } = await api.post<ApiResponse<unknown>>(`${collectionPath(id)}/links`, { url });
  return listingAttachmentSchema.parse(data.data);
}
export async function uploadListingRevisionEvidence(
  id: string,
  item: Extract<EvidenceItem, { kind: 'file' }>,
) {
  const body = new FormData();
  let cleanup: (() => void) | undefined;
  try {
    if (item.uri.startsWith('listing-evidence:')) {
      const parts = item.uri.slice('listing-evidence:'.length).split('/');
      if (parts.length !== 2) throw new Error('기존 증빙 파일 정보를 확인하지 못했습니다.');
      const path = `${collectionPath(decodeURIComponent(parts[0]))}/attachments/${encodeURIComponent(decodeURIComponent(parts[1]))}/content`;
      if (Platform.OS === 'web') {
        const response = await api.get<Blob>(path, { responseType: 'blob' });
        body.append('files', new Blob([response.data], { type: item.mimeType }), item.name);
      } else {
        const response = await api.get<ArrayBuffer>(path, { responseType: 'arraybuffer' });
        const { File, Paths } = await import('expo-file-system');
        const temporary = new File(
          Paths.cache,
          `revision-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        );
        cleanup = () => {
          if (temporary.exists) temporary.delete();
        };
        temporary.create();
        temporary.write(new Uint8Array(response.data));
        body.append('files', {
          uri: temporary.uri,
          name: item.name,
          type: item.mimeType,
        } as unknown as Blob);
      }
    } else if (Platform.OS === 'web') {
      if (!/^(blob:|data:)/.test(item.uri)) throw new Error('파일을 다시 선택해 주세요.');
      const response = await fetch(item.uri);
      body.append('files', await response.blob(), item.name);
    } else {
      body.append('files', {
        uri: item.uri,
        name: item.name,
        type: item.mimeType,
      } as unknown as Blob);
    }
    const { data } = await api.post<ApiResponse<unknown>>(`${collectionPath(id)}/uploads`, body, {
      timeout: 60_000,
    });
    const attachments = z.array(listingAttachmentSchema).parse(data.data);
    if (attachments.length !== 1 || attachments[0].kind !== 'FILE')
      throw new Error('업로드 결과를 확인하지 못했습니다.');
    return attachments[0];
  } finally {
    cleanup?.();
  }
}
export async function saveListingRevisionEvidence(
  id: string,
  attachmentIds: string[],
  description: string,
) {
  const { data } = await api.put<ApiResponse<unknown>>(collectionPath(id), {
    attachmentIds,
    description,
    validateStep: true,
  });
  const collection = listingFileCollectionSchema.parse(data.data);
  if (
    collection.purpose !== 'EVIDENCE' ||
    attachmentIds.some((id) => !collection.attachments.some((item) => item.id === id && item.saved))
  )
    throw new Error('증빙 자료 저장 결과를 확인하지 못했습니다.');
  return collection;
}
