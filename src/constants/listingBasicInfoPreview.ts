import type { ListingBasicInfoForm } from '@/schemas/listingBasicInfoSchema';

export const EMPTY_LISTING_BASIC_INFO: ListingBasicInfoForm = {
  serviceName: '',
  introduction: '',
  description: '',
  category: '',
  logo: null,
  coverImage: null,
  officialUrl: '',
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
};

export const LISTING_BASIC_INFO_PREVIEW: ListingBasicInfoForm = {
  serviceName: 'SaaS Index',
  introduction: 'SaaS 성장성을 모의투자하는 상품',
  description: '',
  category: 'SaaS / 소프트웨어',
  logo: {
    uri: '',
    name: 'saas-index-logo.png',
    size: 235 * 1024,
    mimeType: 'image/png',
    width: 480,
    height: 480,
    isPreview: true,
  },
  coverImage: {
    uri: '',
    name: 'saas-index-cover.jpg',
    size: Math.round(1.8 * 1024 * 1024),
    mimeType: 'image/jpeg',
    width: 1200,
    height: 630,
    isPreview: true,
  },
  officialUrl: '',
  companyName: '마스외전',
  contactName: '김민혁',
  email: 'plan@example.com',
  phone: '010-1234-5678',
};
