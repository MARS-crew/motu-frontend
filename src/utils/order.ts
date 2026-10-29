import { isAxiosError } from 'axios';

import { ORDER_ERROR_MESSAGES, ORDER_FEE_RATE } from '@/constants/order';
import type { ApiErrorResponse } from '@/types/api';
import type { OrderAmounts, OrderAvailability, OrderAvailableItem, OrderSide } from '@/types/order';

// 수수료는 소수점 이하를 버립니다. 실제 값은 체결 시 서버에서 확정됩니다.
export const getOrderAmounts = (
  side: OrderSide,
  price: number,
  quantity: number,
  feeRate = ORDER_FEE_RATE,
): OrderAmounts => {
  const amount = price * quantity;
  const fee = Math.floor(amount * feeRate);

  return {
    price,
    quantity,
    amount,
    fee,
    total: side === 'buy' ? amount + fee : amount - fee,
  };
};

export const parseOrderNumber = (value: string) => {
  const number = Number(value.replaceAll(',', ''));
  return Number.isSafeInteger(number) ? number : 0;
};

export const formatOrderNumberInput = (value: string) => {
  const digits = value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  return digits ? Number(digits).toLocaleString('ko-KR') : '';
};

const padTwo = (value: number) => String(value).padStart(2, '0');

// 피그마 표기인 '2026. 09. 13 02:10:29' 형식으로 바꿉니다.
export const formatOrderedAt = (date: Date) =>
  `${date.getFullYear()}. ${padTwo(date.getMonth() + 1)}. ${padTwo(date.getDate())} ${padTwo(
    date.getHours(),
  )}:${padTwo(date.getMinutes())}:${padTwo(date.getSeconds())}`;

// 주문 가능 정보 API 응답을 주문 화면에서 쓰는 형태로 바꿉니다.
export const toOrderAvailability = (item: OrderAvailableItem): OrderAvailability => ({
  isTradable: item.tradeStatus === 'ACTIVE',
  tickSize: item.priceTickSize,
  minPrice: item.minOrderPrice,
  minQuantity: item.minOrderQty,
  feeRate: item.feeRate,
  availablePoints: item.availableCash,
  sellableQuantity: item.sellableQty,
});

// 화면설계서에 정해진 오류는 설계서 문구로 바꿉니다. (USR-MARKET-02-M04, M07)
const ORDER_ERROR_CODE_MESSAGES: Record<string, string> = {
  ORDER_INVALID_PRICE_TICK: ORDER_ERROR_MESSAGES.tickSize,
  ORDER_PRICE_TOO_LOW: ORDER_ERROR_MESSAGES.price,
  ORDER_QTY_TOO_LOW: ORDER_ERROR_MESSAGES.minQuantity,
  ORDER_INSUFFICIENT_CASH: ORDER_ERROR_MESSAGES.points,
  ORDER_INSUFFICIENT_QTY: ORDER_ERROR_MESSAGES.sellableQuantity,
};

// 거래 불가 등 설계서에 없는 409 오류는 서버 문구를 쓰고, 그 밖의 오류는 공통 문구를 씁니다.
export const getOrderErrorMessage = (error: unknown) => {
  if (!isAxiosError<ApiErrorResponse>(error)) return ORDER_ERROR_MESSAGES.server;
  const serverError = error.response?.data?.error;
  if (!serverError) return ORDER_ERROR_MESSAGES.server;
  if (serverError.code in ORDER_ERROR_CODE_MESSAGES)
    return ORDER_ERROR_CODE_MESSAGES[serverError.code];
  if (error.response?.status === 409) return serverError.message;
  return ORDER_ERROR_MESSAGES.server;
};
