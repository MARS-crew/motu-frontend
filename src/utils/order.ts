import { ORDER_FEE_RATE } from '@/constants/order';
import type { OrderAmounts, OrderSide } from '@/types/order';

// 수수료는 소수점 이하를 버립니다. 실제 값은 체결 시 서버에서 확정됩니다.
export const getOrderAmounts = (side: OrderSide, price: number, quantity: number): OrderAmounts => {
  const amount = price * quantity;
  const fee = Math.floor(amount * ORDER_FEE_RATE);

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
