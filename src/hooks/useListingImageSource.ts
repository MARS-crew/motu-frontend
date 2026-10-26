import { useEffect, useState } from 'react';
import type { ImageSource } from 'expo-image';

import { getListingImageSource } from '@/apis/listingFile';
import type { ListingImage } from '@/schemas/listingBasicInfoSchema';

export function useListingImageSource(file: ListingImage | null) {
  const [remoteSource, setRemoteSource] = useState<{ key: string; source: ImageSource } | null>(
    null,
  );
  const key =
    file?.collectionId && file.attachmentId && /^https?:/.test(file.uri)
      ? `${file.collectionId}/${file.attachmentId}`
      : null;
  useEffect(() => {
    if (!file || !key) return;
    let isActive = true;
    void getListingImageSource(file)
      .then((source) => {
        if (isActive) setRemoteSource({ key, source });
      })
      .catch(() => {});
    return () => {
      isActive = false;
    };
  }, [file, key]);
  if (!file) return undefined;
  return key ? (remoteSource?.key === key ? remoteSource.source : undefined) : { uri: file.uri };
}
