import { create } from 'zustand';

export const POINT_GRANT_AMOUNT = 100000;
export const POINT_GRANT_INTERVAL = 24 * 60 * 60 * 1000;

type PointReceipt = {
  previousBalance: number;
  balance: number;
  grantedAt: number;
};

type PointPreviewState = {
  balance: number;
  receipt: PointReceipt | null;
  grantPoints: () => boolean;
};

// 퍼블리싱 확인용 메모리 상태입니다. 서버 연동 시 Query로 대체합니다
export const usePointPreviewStore = create<PointPreviewState>((set, get) => ({
  balance: 2345678,
  receipt: null,
  grantPoints: () => {
    const { balance, receipt } = get();
    const now = Date.now();
    if (receipt && now < receipt.grantedAt + POINT_GRANT_INTERVAL) return false;
    const nextBalance = balance + POINT_GRANT_AMOUNT;
    set({
      balance: nextBalance,
      receipt: { previousBalance: balance, balance: nextBalance, grantedAt: now },
    });
    return true;
  },
}));
