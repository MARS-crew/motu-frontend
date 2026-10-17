import { MARKET_PRODUCTS } from '@/constants/marketPreview';
import { PRODUCTS } from '@/constants/productPreview';
import type { ChartPeriod, ProductCandle, ProductDetail } from '@/types/product';

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
};

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

// 상품·기간마다 같은 모양이 나오도록 고정 시드로 만들고, 마지막 종가를 현재가에 맞춥니다.
export const getProductCandles = (
  product: { id: number; price: number },
  period: ChartPeriod,
): ProductCandle[] => {
  let seed = product.id * 97 + PERIOD_SEEDS[period] * 13;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

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

  return {
    ...product,
    description: PRODUCT_DESCRIPTIONS[product.name] ?? `${product.category} 분야 상장 상품`,
    isTradable: true,
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
