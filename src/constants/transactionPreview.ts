export type TransactionPreview = {
  id: string;
  tradedAt: string;
  productName: string;
  side: 'buy' | 'sell';
  amount: number;
};

// 서버 연동 전 거래내역 화면 확인용 데이터
export const TRANSACTION_PREVIEW: TransactionPreview[] = [
  { id: '1', tradedAt: '2026-09-06T15:48', productName: 'BrainNote', side: 'buy', amount: 161000 },
  { id: '2', tradedAt: '2026-09-06T14:32', productName: 'PLI', side: 'buy', amount: 93000 },
  { id: '3', tradedAt: '2026-09-06T13:05', productName: 'CloudWorks', side: 'sell', amount: 52200 },
  { id: '4', tradedAt: '2026-09-06T11:15', productName: 'TRIP', side: 'sell', amount: 52500 },
  { id: '5', tradedAt: '2026-09-06T10:02', productName: 'FitLife', side: 'buy', amount: 60000 },
  { id: '6', tradedAt: '2026-09-05T16:21', productName: 'PLAY', side: 'sell', amount: 56800 },
  { id: '7', tradedAt: '2026-09-05T14:47', productName: 'GreenCart', side: 'buy', amount: 100500 },
  { id: '8', tradedAt: '2026-09-05T13:10', productName: 'NEXUS', side: 'sell', amount: 30000 },
  { id: '9', tradedAt: '2026-09-05T11:26', productName: 'Nexpress', side: 'buy', amount: 49000 },
  { id: '10', tradedAt: '2026-09-05T09:41', productName: 'PLI', side: 'buy', amount: 180000 },
  { id: '11', tradedAt: '2026-09-04T16:22', productName: 'PLAY', side: 'sell', amount: 123750 },
  { id: '12', tradedAt: '2026-09-03T15:06', productName: 'FitLife', side: 'sell', amount: 31200 },
];

export const TRANSACTION_SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '금액순', value: 'amount' },
];
