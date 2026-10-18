import type { ListingTradingInfoForm } from '@/schemas/listingTradingInfoSchema';

// 서버 연결 전 Figma의 날짜 선택 상태를 재현하기 위한 기준일입니다.
export const LISTING_CALENDAR_TODAY = '2026-09-10';
export const EMPTY_LISTING_TRADING_INFO: ListingTradingInfoForm = {
  listingPrice: '',
  totalQuantity: '',
  minimumOrderQuantity: '1',
  tickSize: '10',
  tradingStartAt: '2026.09.15 09:00',
  priceReason: '',
};
export const LISTING_TRADING_INFO_PREVIEW: ListingTradingInfoForm = {
  ...EMPTY_LISTING_TRADING_INFO,
  listingPrice: '12,000',
  totalQuantity: '100,000',
};
