export type CompletedOrderPreview = {
  id: string;
  tradedAt: string;
  productName: string;
  side: 'buy' | 'sell';
  orderPrice: number;
  filledQuantity: number;
  amount: number;
};

// 서버 연동 전 체결주문 화면 확인용 데이터
export const COMPLETED_ORDER_PREVIEW: CompletedOrderPreview[] = [
  {
    id: 'filled-1',
    tradedAt: '2026-09-02T09:58',
    productName: 'BrainNote',
    side: 'sell',
    orderPrice: 8800,
    filledQuantity: 25,
    amount: 220000,
  },
  {
    id: 'filled-2',
    tradedAt: '2026-09-03T10:12',
    productName: 'BrainNote',
    side: 'buy',
    orderPrice: 8750,
    filledQuantity: 24,
    amount: 210000,
  },
  {
    id: 'filled-3',
    tradedAt: '2026-09-05T09:41',
    productName: 'PLI',
    side: 'buy',
    orderPrice: 9000,
    filledQuantity: 20,
    amount: 180000,
  },
  {
    id: 'filled-4',
    tradedAt: '2026-09-02T15:47',
    productName: 'CloudWorks',
    side: 'buy',
    orderPrice: 8350,
    filledQuantity: 20,
    amount: 167000,
  },
  {
    id: 'filled-5',
    tradedAt: '2026-09-04T16:22',
    productName: 'PLAY',
    side: 'sell',
    orderPrice: 8250,
    filledQuantity: 15,
    amount: 123750,
  },
  {
    id: 'filled-6',
    tradedAt: '2026-09-06T14:32',
    productName: 'PLI',
    side: 'buy',
    orderPrice: 9300,
    filledQuantity: 10,
    amount: 93000,
  },
  {
    id: 'filled-7',
    tradedAt: '2026-09-06T11:15',
    productName: 'TRIP',
    side: 'sell',
    orderPrice: 5250,
    filledQuantity: 10,
    amount: 52500,
  },
  {
    id: 'filled-8',
    tradedAt: '2026-09-01T13:20',
    productName: 'GreenCart',
    side: 'sell',
    orderPrice: 6400,
    filledQuantity: 6,
    amount: 38400,
  },
  {
    id: 'filled-9',
    tradedAt: '2026-09-03T15:06',
    productName: 'FitLife',
    side: 'sell',
    orderPrice: 10400,
    filledQuantity: 3,
    amount: 31200,
  },
  {
    id: 'filled-10',
    tradedAt: '2026-09-01T10:44',
    productName: 'Nexpress',
    side: 'sell',
    orderPrice: 986,
    filledQuantity: 25,
    amount: 24650,
  },
  // 두 번째·세 번째 페이지와 시안의 전체 합계 확인용 추가 데이터
  ...Array.from({ length: 20 }, (_, index): CompletedOrderPreview => ({
    id: `filled-${index + 11}`,
    tradedAt: `2026-09-01T09:${String(index).padStart(2, '0')}`,
    productName: 'Nexpress',
    side: 'sell',
    orderPrice: 5492,
    filledQuantity: 1,
    amount: 5492,
  })),
];
