export type Account = {
  // 보유 포인트입니다. (주문에 예약된 포인트 포함)
  cash: number;
  // 매수 주문에 예약된 포인트입니다.
  lockedCash: number;
  // 사용 가능 포인트입니다. (보유 포인트 - 예약 포인트)
  availableCash: number;
};
