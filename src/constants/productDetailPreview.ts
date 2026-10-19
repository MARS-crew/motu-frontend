import { MARKET_PRODUCTS } from '@/constants/marketPreview';
import { PRODUCTS } from '@/constants/productPreview';
import type {
  ChartPeriod,
  OrderBook,
  ProductCandle,
  ProductDetail,
  ProductInfo,
  RecentTrade,
  TradeStatus,
} from '@/types/product';

export const CHART_PERIOD_OPTIONS: { label: string; value: ChartPeriod }[] = [
  { label: '분', value: 'minute' },
  { label: '시간', value: 'hour' },
  { label: '1일', value: 'day' },
  { label: '1주', value: 'week' },
  { label: '1개월', value: 'month' },
];

// 퍼블리싱 확인용 데이터입니다. 서버 연동 시 Query로 대체합니다
const CANDLE_COUNT = 40;

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  삼성전자: '반도체·모바일·가전을 아우르는 글로벌 전자 기업',
  카카오: '메신저·플랫폼·콘텐츠 사업을 운영하는 IT 기업',
  NAVER: '검색·커머스·핀테크 서비스를 운영하는 IT 기업',
  쌍방울: '의류·섬유 제조와 유통을 함께 운영하는 생활 소재 기업',
};

// 종목 정보 탭 확인용 데이터입니다. 없는 상품은 '정보없음'으로 표시됩니다.
const PRODUCT_INFOS: Record<string, Omit<ProductInfo, 'listedAt'>> = {
  삼성전자: {
    introduction:
      '반도체·모바일·가전을 아우르는 글로벌 전자 기업입니다. 메모리 반도체와 파운드리, 스마트폰 사업을 중심으로 세계 시장을 선도하며 차세대 기술 투자를 이어가고 있습니다.',
    operator: '삼성전자',
    officialUrl: 'https://www.samsung.com/sec',
    metrics: ['글로벌 임직원: 27만 명', '특허 등록: 12만 건 이상', '평균 수익률: +4.06%'],
  },
  쌍방울: {
    introduction:
      '의류·섬유 제조와 유통을 함께 운영하는 생활 소재 기업입니다. 봉제 의류 생산과 브랜드 유통 사업을 병행하며 온라인 커머스 채널을 확장하고 있습니다.',
    operator: '쌍방울',
    officialUrl: 'https://www.ssangbangwool.com',
    metrics: ['생산 라인: 국내외 6개', '유통 채널: 210개', '평균 수익률: +1.55%'],
  },
  PLI: {
    introduction:
      'PLI는 AI를 활용해 사용자의 취향과 여행 조건을 분석하고, 맞춤형 여행 일정과 장소를 추천해주는 여행 플래닝 앱입니다. 여행지 탐색부터 일정 구성까지 쉽고 빠르게 계획할 수 있도록 지원합니다.',
    operator: '마스외전',
    officialUrl: 'https://mars-pli.kro.kr',
    metrics: [
      '누적 가입자: 20만 명',
      '월간 활성 사용자(MAU): 10만 명',
      '누적 모의 투자 금액: 1,234,567 P',
      '평균 수익률: +2.5%',
    ],
  },
};

// 거래 상태별 화면 확인을 위해 일부 상품의 상태를 바꿔 둡니다.
const PRODUCT_TRADE_STATUSES: Record<string, TradeStatus> = {
  쌍방울: 'suspended',
  대유플러스: 'waiting',
  대신정보통신: 'ended',
};

const LISTED_DATES: Record<string, string> = {
  삼성전자: '2026.01.05',
  쌍방울: '2026.02.11',
  PLI: '2026.08.28',
};

// '2026.01.05' 형식을 피그마 표기인 '2026. 01. 05'로 바꿉니다.
const formatListedAt = (value: string) => value.split('.').join('. ');

const PERIOD_STARTS: Record<ChartPeriod, Date> = {
  minute: new Date(2026, 7, 7, 9, 0),
  hour: new Date(2026, 7, 5, 9, 0),
  day: new Date(2026, 6, 3),
  week: new Date(2025, 10, 7),
  month: new Date(2023, 4, 1),
};

const getTimestamp = (period: ChartPeriod, index: number) => {
  const date = new Date(PERIOD_STARTS[period]);
  if (period === 'minute') date.setMinutes(date.getMinutes() + index);
  if (period === 'hour') date.setHours(date.getHours() + index);
  if (period === 'day') date.setDate(date.getDate() + index);
  if (period === 'week') date.setDate(date.getDate() + index * 7);
  if (period === 'month') date.setMonth(date.getMonth() + index);
  return date.getTime();
};

const PERIOD_SEEDS: Record<ChartPeriod, number> = { minute: 1, hour: 2, day: 3, week: 4, month: 5 };

const createRandom = (initialSeed: number) => {
  let seed = initialSeed;
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
};

// 상품·기간마다 같은 모양이 나오도록 고정 시드로 만들고, 마지막 종가를 현재가에 맞춥니다.
export const getProductCandles = (
  product: { id: number; price: number },
  period: ChartPeriod,
): ProductCandle[] => {
  const random = createRandom(product.id * 97 + PERIOD_SEEDS[period] * 13);

  const candles: ProductCandle[] = [];
  let close = product.price;
  for (let index = CANDLE_COUNT - 1; index >= 0; index--) {
    const open = close * (1 + (random() - 0.5) * 0.05);
    candles.unshift({
      timestamp: getTimestamp(period, index),
      open: Math.round(open),
      high: Math.round(Math.max(open, close) * (1 + random() * 0.012)),
      low: Math.round(Math.min(open, close) * (1 - random() * 0.012)),
      close: Math.round(close),
      volume: Math.round(200_000 * (0.4 + random() * 0.8)),
    });
    close = open * (1 + (random() - 0.5) * 0.01);
  }
  return candles;
};

export const getProductDetail = (id: number): ProductDetail | undefined => {
  const product =
    MARKET_PRODUCTS.find((item) => item.id === id) ?? PRODUCTS.find((item) => item.id === id);
  if (!product) return undefined;

  const latest = getProductCandles(product, 'day').at(-1);
  if (!latest) return undefined;

  const listedAt =
    LISTED_DATES[product.name] ?? ('listedAt' in product ? product.listedAt : undefined);

  return {
    ...product,
    description: PRODUCT_DESCRIPTIONS[product.name] ?? `${product.category} 분야 상장 상품`,
    tradeStatus: PRODUCT_TRADE_STATUSES[product.name] ?? 'tradable',
    info: {
      ...PRODUCT_INFOS[product.name],
      metrics: PRODUCT_INFOS[product.name]?.metrics ?? [],
      listedAt: listedAt ? formatListedAt(listedAt) : undefined,
    },
    summary: {
      open: latest.open,
      high: latest.high,
      low: latest.low,
      close: latest.close,
      volume: latest.volume,
      tradeAmount: latest.volume * latest.close,
    },
  };
};

const ORDER_BOOK_DEPTH = 5;
const RECENT_TRADE_COUNT = 5;

// 가격대별 호가 단위입니다. 실제 단위는 상장 심사에서 확정된 값을 서버에서 받습니다.
const getTickSize = (price: number) => {
  if (price < 1_000) return 1;
  if (price < 5_000) return 5;
  if (price < 50_000) return 50;
  return 100;
};

const getBasePrice = (price: number) => {
  const tickSize = getTickSize(price);
  return { tickSize, basePrice: Math.round(price / tickSize) * tickSize };
};

export const getOrderBook = (product: { id: number; price: number }): OrderBook => {
  const random = createRandom(product.id * 131);
  const { tickSize, basePrice } = getBasePrice(product.price);
  const createQuantity = () => Math.round(1_000 + random() * 24_000);

  return {
    asks: Array.from({ length: ORDER_BOOK_DEPTH }, (_, index) => ({
      price: basePrice + tickSize * (index + 1),
      quantity: createQuantity(),
    })),
    bids: Array.from({ length: ORDER_BOOK_DEPTH }, (_, index) => ({
      price: basePrice - tickSize * (index + 1),
      quantity: createQuantity(),
    })),
  };
};

const LAST_TRADE_TIME = new Date(2026, 7, 7, 15, 29, 27);

// 매도 체결은 매수 1호가, 매수 체결은 현재가에 체결된 것으로 만듭니다.
export const getRecentTrades = (product: { id: number; price: number }): RecentTrade[] => {
  const random = createRandom(product.id * 173);
  const { tickSize, basePrice } = getBasePrice(product.price);
  const time = new Date(LAST_TRADE_TIME);

  return Array.from({ length: RECENT_TRADE_COUNT }, (_, index) => {
    if (index > 0) time.setSeconds(time.getSeconds() - Math.round(20 + random() * 20));
    const side = random() < 0.5 ? 'sell' : 'buy';

    return {
      id: index,
      time: time.toTimeString().slice(0, 8),
      price: side === 'sell' ? basePrice - tickSize : basePrice,
      quantity: Math.round(10 + random() * 490),
      side,
    };
  });
};
