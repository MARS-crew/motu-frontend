import type { ListingDraftDetail, ListingTradingDraftData } from '@/schemas/listingDraftSchema';
import {
  listingTradingInfoSchema,
  type ListingTradingInfoForm,
} from '@/schemas/listingTradingInfoSchema';

export function toListingTradingDraftData(values: ListingTradingInfoForm): ListingTradingDraftData {
  const date = values.tradingStartAt.trim();
  const hasValidDate = listingTradingInfoSchema.shape.tradingStartAt.safeParse(date).success;
  const numericText = (value: string) => {
    const text = value.trim();
    // 유효한 천 단위 구분자만 제거하고, 미완성 숫자 입력은 그대로 보관합니다.
    return (/^\d{1,3}(?:,\d{3})+$/.test(text) ? text.replaceAll(',', '') : text) || null;
  };
  return {
    desiredPrice: numericText(values.listingPrice),
    totalIssuedQuantity: numericText(values.totalQuantity),
    minOrderQuantity: values.minimumOrderQuantity || null,
    tickSize: values.tickSize || null,
    priceCalculationBasis: values.priceReason.trim() || null,
    // 날짜 선택기는 KST를 사용합니다. 미완성 날짜는 그대로 보관합니다.
    desiredListingDate: hasValidDate
      ? `${date.slice(0, 10).replaceAll('.', '-')}T${date.slice(11)}:00+09:00`
      : date || null,
  };
}

export function toListingTradingForm(draft: ListingDraftDetail): ListingTradingInfoForm {
  const data = draft.data;
  let tradingStartAt = data.desiredListingDate ?? '';
  // ISO 응답을 기기 시간대와 관계없이 KST 화면 형식으로 복원합니다.
  if (/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(tradingStartAt)) {
    const timestamp = Date.parse(tradingStartAt);
    if (Number.isFinite(timestamp)) {
      const kst = new Date(timestamp + 9 * 60 * 60 * 1000).toISOString();
      tradingStartAt = `${kst.slice(0, 10).replaceAll('-', '.')} ${kst.slice(11, 16)}`;
    }
  }
  const displayNumber = (value: string | null | undefined) => {
    if (!value) return '';
    const number = Number(value.replaceAll(',', ''));
    return /^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value) && Number.isSafeInteger(number)
      ? number.toLocaleString('en-US')
      : value;
  };
  // 서버의 미완성/비허용 선택값도 유지하고, '다음'에서 스키마로 검증합니다.
  return {
    listingPrice: displayNumber(data.desiredPrice),
    totalQuantity: displayNumber(data.totalIssuedQuantity),
    minimumOrderQuantity: (data.minOrderQuantity ??
      '1') as ListingTradingInfoForm['minimumOrderQuantity'],
    tickSize: (data.tickSize ?? '10') as ListingTradingInfoForm['tickSize'],
    tradingStartAt,
    priceReason: data.priceCalculationBasis ?? '',
  };
}
