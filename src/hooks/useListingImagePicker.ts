import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';

import { listingImageSchema, type ListingImage } from '@/schemas/listingBasicInfoSchema';

type UseListingImagePickerOptions = {
  onSelect: (field: 'logo' | 'coverImage', file: ListingImage) => void;
  onError: (field: 'logo' | 'coverImage', message: string) => void;
};

export function useListingImagePicker({ onSelect, onError }: UseListingImagePickerOptions) {
  const [targetField, setTargetField] = useState<'logo' | 'coverImage' | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const requestRef = useRef(0);
  const handleClose = () => {
    requestRef.current += 1;
    setIsPicking(false);
    setTargetField(null);
  };
  const handlePick = async (source: 'library' | 'files') => {
    if (!targetField || isPicking) return;
    const field = targetField;
    const requestId = ++requestRef.current;
    setIsPicking(true);
    try {
      let file: ListingImage;
      if (source === 'library') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 1,
        });
        if (result.canceled) return;
        const asset = result.assets[0];
        const size = asset.fileSize ?? asset.file?.size;
        if (size === undefined) throw new Error('size-unavailable');
        file = {
          uri: asset.uri,
          name: asset.fileName ?? asset.uri.split('/').pop() ?? 'image.jpg',
          size,
          mimeType: asset.mimeType ?? '',
          width: asset.width,
          height: asset.height,
        };
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: ['image/jpeg', 'image/png'],
          multiple: false,
          copyToCacheDirectory: true,
          base64: false,
        });
        if (result.canceled) return;
        const asset = result.assets[0];
        const size = asset.size ?? asset.file?.size;
        if (size === undefined) throw new Error('size-unavailable');
        const mimeType =
          asset.mimeType ||
          (/\.png$/i.test(asset.name)
            ? 'image/png'
            : /\.jpe?g$/i.test(asset.name)
              ? 'image/jpeg'
              : '');
        file = { uri: asset.uri, name: asset.name, size, mimeType };
        if (listingImageSchema.safeParse(file).success) {
          const image = await Image.loadAsync(file.uri);
          file.width = image.width;
          file.height = image.height;
        }
      }
      // 잘못된 파일도 폼에 전달해 용량/형식 오류를 일관되게 검증합니다.
      if (requestId === requestRef.current) onSelect(field, file);
    } catch (error: unknown) {
      if (requestId !== requestRef.current) return;
      onError(
        field,
        error instanceof Error && error.message === 'size-unavailable'
          ? '파일 크기를 확인할 수 없습니다. 다른 파일을 선택해 주세요.'
          : '이미지를 불러오지 못했습니다. 다시 선택해 주세요.',
      );
    } finally {
      if (requestId === requestRef.current) {
        setIsPicking(false);
        setTargetField(null);
      }
    }
  };
  return { targetField, isPicking, handleOpen: setTargetField, handleClose, handlePick };
}
