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

// 주문 가능 정보 API 응답입니다. (스웨거 GetOrderAvailableResDto 기준)
export type OrderAvailableItem = {
  stockId: number;
  tradeStatus: 'PENDING' | 'ACTIVE' | 'PAUSED' | 'CLOSED';
  priceTickSize: number;
  minOrderPrice: number;
  minOrderQty: number;
  feeRate: number;
  availableCash: number;
  sellableQty: number;
};

// 주문 화면에서 쓰는 주문 규칙과 사용 가능 포인트·매도 가능 수량입니다.
export type OrderAvailability = {
  isTradable: boolean;
  tickSize: number;
  minPrice: number;
  minQuantity: number;
  feeRate: number;
  availablePoints: number;
  sellableQuantity: number;
};

export type CreateOrderBody = {
  // 중복 요청 방지 키입니다. 주문마다 새로 만들고, 다시 보낼 때는 같은 값을 씁니다.
  clientOrderId: string;
  stockId: number;
  side: 'BUY' | 'SELL';
  price: number;
  qty: number;
};

export type OrderItem = {
  orderId: number;
  clientOrderId: string;
  stockId: number;
  side: 'BUY' | 'SELL';
  orderType: 'LIMIT';
  price: number;
  qty: number;
  filledQty: number;
  remainingQty: number;
  orderAmount: number;
  lockedAmount: number;
  status: 'ACCEPTED' | 'PARTIAL' | 'FILLED' | 'CANCELED';
  createDate: string;
  canceledDate: string | null;
};
