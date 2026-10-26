import { getListingImageUri } from '@/apis/listingFile';
import { EMPTY_LISTING_BASIC_INFO } from '@/constants/listingBasicInfoPreview';
import type { ListingBasicInfoForm, ListingImage } from '@/schemas/listingBasicInfoSchema';
import type { ListingDraftDetail, ListingBasicDraftData } from '@/schemas/listingDraftSchema';
import type { ListingFileCollection } from '@/schemas/listingFileSchema';
import type { Sector } from '@/types/sector';

export function toListingBasicDraftData(
  values: ListingBasicInfoForm,
  sectors: Sector[],
): ListingBasicDraftData {
  const sector = sectors.find((item) => item.sectorName === values.category);
  if (values.category && !sector)
    throw new Error('카테고리 정보를 확인하지 못했습니다. 다시 시도해 주세요.');
  return {
    serviceName: values.serviceName || null,
    summary: values.introduction || null,
    description: values.description || null,
    officialUrl: values.officialUrl || null,
    operatorName: values.companyName || null,
    managerName: values.contactName || null,
    businessEmail: values.email || null,
    contactPhone: values.phone || null,
    sectorCode: sector?.sectorCode ?? null,
    logoCollectionId: values.logo?.collectionId ?? null,
    mainImageCollectionId: values.coverImage?.collectionId ?? null,
  };
}

export function toListingRemoteImage(
  collection: ListingFileCollection | null,
): ListingImage | null {
  const image = collection?.attachments.find(
    (attachment) => attachment.kind === 'FILE' && attachment.saved,
  );
  if (!collection || !image) return null;
  return {
    uri: getListingImageUri(collection.id, image.id),
    name: image.originalName ?? 'image',
    size: image.size ?? 0,
    mimeType: image.contentType ?? '',
    collectionId: collection.id,
    attachmentId: image.id,
  };
}

export function toListingBasicForm(
  draft: ListingDraftDetail,
  sectors: Sector[],
  logo: ListingFileCollection | null,
  cover: ListingFileCollection | null,
): ListingBasicInfoForm {
  const data = draft.data;
  return {
    ...EMPTY_LISTING_BASIC_INFO,
    serviceName: data.serviceName ?? '',
    introduction: data.summary ?? '',
    description: data.description ?? '',
    officialUrl: data.officialUrl ?? '',
    companyName: data.operatorName ?? '',
    contactName: data.managerName ?? '',
    email: data.businessEmail ?? '',
    phone: data.contactPhone ?? '',
    category: sectors.find((sector) => sector.sectorCode === data.sectorCode)?.sectorName ?? '',
    logo: toListingRemoteImage(logo),
    coverImage: toListingRemoteImage(cover),
  };
}
