import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useRef, useState } from 'react';

import {
  EVIDENCE_FILE_TYPES,
  evidenceFileSchema,
  type EvidenceFile,
} from '@/schemas/listingEvidenceSchema';
import { createEvidenceId, getEvidenceMimeType } from '@/utils/listingEvidence';

type UseListingEvidencePickerOptions = {
  onSelect: (files: EvidenceFile[]) => void;
  onError: (message: string) => void;
};

export function useListingEvidencePicker({ onSelect, onError }: UseListingEvidencePickerOptions) {
  const [isPicking, setIsPicking] = useState(false);
  const isPickingRef = useRef(false);
  const requestRef = useRef(0);
  useEffect(
    () => () => {
      requestRef.current += 1;
    },
    [],
  );
  const handlePick = async () => {
    if (isPickingRef.current) return;
    isPickingRef.current = true;
    setIsPicking(true);
    const requestId = ++requestRef.current;
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: EVIDENCE_FILE_TYPES,
        multiple: true,
        copyToCacheDirectory: true,
        base64: false,
      });
      if (result.canceled || requestRef.current !== requestId) return;
      const files: EvidenceFile[] = [];
      for (const asset of result.assets) {
        const size = asset.size ?? asset.file?.size;
        if (size === undefined) {
          onError('파일 크기를 확인할 수 없습니다. 다른 파일을 선택해 주세요.');
          return;
        }
        const parsed = evidenceFileSchema.safeParse({
          id: createEvidenceId(),
          kind: 'file',
          name: asset.name,
          uri: asset.uri,
          size,
          mimeType: getEvidenceMimeType(asset.name, asset.mimeType),
        });
        if (!parsed.success) {
          onError(parsed.error.issues[0].message);
          return;
        }
        files.push(parsed.data);
      }
      onSelect(files);
    } catch {
      if (requestRef.current === requestId)
        onError('파일을 불러오지 못했습니다. 다시 선택해 주세요.');
    } finally {
      if (requestRef.current === requestId) {
        isPickingRef.current = false;
        setIsPicking(false);
      }
    }
  };
  return { isPicking, handlePick };
}
