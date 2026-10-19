export type OrderSide = 'buy' | 'sell';

export type OrderStep = 'input' | 'confirm' | 'complete';

export type OrderAmounts = {
  price: number;
  quantity: number;
  amount: number;
  fee: number;
  // 매수는 주문 금액 + 수수료, 매도는 주문 금액 - 수수료(총 수령 금액)입니다.
  total: number;
};

export type SubmittedOrder = OrderAmounts & {
  orderedAt: string;
};
