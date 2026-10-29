// 지정가 알림 API 응답 타입입니다. (스웨거 PriceAlertResDto 기준)
export type PriceAlertItem = {
  alertId: number;
  stockId: number;
  stockName: string;
  targetPrice: number;
  currentPrice: number;
  // 설정 가격에 도달해 알림이 울렸거나 거래가 종료된 상품이면 false입니다.
  isActive: boolean;
  triggeredDate: string | null;
  createDate: string;
};
