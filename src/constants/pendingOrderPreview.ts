export type PendingOrderPreview = {
  id: string;
  productName: string;
  orderedAt: string;
  side: 'buy' | 'sell';
  orderPrice: number;
  quantity: number;
  remainingQuantity: number;
  badgeClassName: string;
};

// 서버 연동 전 미체결주문 화면 확인용 데이터
export const PENDING_ORDER_PREVIEW: PendingOrderPreview[] = [
  {
    id: 'pending-1',
    productName: 'CloudWorks',
    orderedAt: '2026-09-06T10:20',
    side: 'buy',
    orderPrice: 8000,
    quantity: 30,
    remainingQuantity: 30,
    badgeClassName: 'bg-motu-green',
  },
  {
    id: 'pending-2',
    productName: 'PLI',
    orderedAt: '2026-09-06T15:10',
    side: 'buy',
    orderPrice: 9200,
    quantity: 15,
    remainingQuantity: 10,
    badgeClassName: 'bg-motu-black',
  },
  {
    id: 'pending-3',
    productName: 'NEXUS',
    orderedAt: '2026-09-05T16:40',
    side: 'sell',
    orderPrice: 9000,
    quantity: 12,
    remainingQuantity: 5,
    badgeClassName: 'bg-motu-slate',
  },
  {
    id: 'pending-4',
    productName: 'PLAY',
    orderedAt: '2026-09-04T14:15',
    side: 'sell',
    orderPrice: 13000,
    quantity: 8,
    remainingQuantity: 8,
    badgeClassName: 'bg-motu-brown',
  },
];
