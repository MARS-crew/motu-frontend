import type { OrderSide } from '@/types/order';

// 화면설계서 기준 주문 규칙입니다. (USR-MARKET-02-M02 ~ M07)
export const MIN_ORDER_QUANTITY = 1;
export const ORDER_QUANTITY_PRESETS = [10, 50, 100, 1000];
// 거래 수수료는 실제 체결금액 기준 0.02%입니다.
export const ORDER_FEE_RATE = 0.0002;

export const ORDER_SIDE_STYLES: Record<
  OrderSide,
  {
    label: string;
    badgeLabel: string;
    buttonColor: 'red' | 'blue';
    textClassName: string;
    bgClassName: string;
    borderClassName: string;
  }
> = {
  buy: {
    label: '매수',
    badgeLabel: '매',
    buttonColor: 'red',
    textClassName: 'text-motu-red',
    bgClassName: 'bg-motu-red',
    borderClassName: 'border-motu-red/50',
  },
  sell: {
    label: '매도',
    badgeLabel: '도',
    buttonColor: 'blue',
    textClassName: 'text-motu-blue',
    bgClassName: 'bg-motu-blue',
    borderClassName: 'border-motu-blue/50',
  },
};

export const ORDER_ERROR_MESSAGES = {
  price: '주문 가격을 다시 확인해 주세요.',
  tickSize: '주문 가격이 호가 단위와 맞지 않습니다. 다시 확인해 주세요.',
  quantity: '주문 수량을 다시 확인해 주세요.',
  minQuantity: '최소 주문 수량 이상 입력해 주세요.',
  points: '사용 가능한 포인트가 부족합니다. 보유 포인트를 확인해 주세요.',
  sellableQuantity: '매도 가능한 수량이 부족합니다. 보유 수량을 확인해 주세요.',
  server: '주문 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
};
