import type { TradeStatus } from '@/types/product';

// 거래 상태별 문구와 색상입니다. (화면설계서 USR-MARKET-02-01)
export const TRADE_STATUS_STYLES: Record<
  TradeStatus,
  { label: string; textClassName: string; badgeClassName: string; dotClassName: string }
> = {
  waiting: {
    label: '거래 대기',
    textClassName: 'text-motu-amber',
    badgeClassName: 'bg-motu-amber/10',
    dotClassName: 'bg-motu-amber',
  },
  tradable: {
    label: '거래 가능',
    textClassName: 'text-motu-green',
    badgeClassName: 'bg-motu-green/10',
    dotClassName: 'bg-motu-green',
  },
  suspended: {
    label: '거래 중지',
    textClassName: 'text-motu-red',
    badgeClassName: 'bg-motu-red/10',
    dotClassName: 'bg-motu-red',
  },
  ended: {
    label: '거래 종료',
    textClassName: 'text-motu-grey',
    badgeClassName: 'bg-motu-grey-lighter',
    dotClassName: 'bg-motu-grey-light',
  },
};
