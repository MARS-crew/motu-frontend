import { create } from 'zustand';

export const POINT_GRANT_AMOUNT = 100000;
export const POINT_GRANT_INTERVAL = 24 * 60 * 60 * 1000;

type PointReceipt = {
  previousBalance: number;
  balance: number;
  grantedAt: number;
};

export const POINT_RESET_BALANCE = 3000000;
export const POINT_RESET_INTERVAL = 7 * 24 * 60 * 60 * 1000;

type ResetConditions = {
  holdingCount: number;
  openOrderCount: number;
  pendingTradeCount: number;
  reservedPoints: number;
  lastResetAt: number | null;
};

export function getPointResetReason(conditions: ResetConditions, now: number): string | null {
  if (conditions.holdingCount > 0) return '현재 보유 종목이 존재해 리셋이 불가능합니다.';
  if (conditions.openOrderCount > 0) return '미체결 주문이 존재해 리셋이 불가능합니다.';
  if (conditions.pendingTradeCount > 0) return '처리 중인 거래가 존재해 리셋이 불가능합니다.';
  if (conditions.reservedPoints > 0) return '주문에 예약된 포인트가 있어 리셋이 불가능합니다.';
  if (conditions.lastResetAt !== null && now < conditions.lastResetAt + POINT_RESET_INTERVAL)
    return '마지막 포인트 리셋 후 7일이 지나지 않았습니다.';
  return null;
}

type PointPreviewState = ResetConditions & {
  balance: number;
  receipt: PointReceipt | null;
  grantPoints: () => boolean;
  resetReceipt: { previousBalance: number; balance: number; resetAt: number } | null;
  resetPoints: () => boolean;
};

// 퍼블리싱 확인용 메모리 상태입니다. 서버 연동 시 Query로 대체합니다
export const usePointPreviewStore = create<PointPreviewState>((set, get) => ({
  balance: 2345678,
  receipt: null,
  // 비활성화 화면 확인 시 holdingCount를 1로 변경합니다.
  holdingCount: 0,
  openOrderCount: 0,
  pendingTradeCount: 0,
  reservedPoints: 0,
  lastResetAt: null,
  resetReceipt: null,
  resetPoints: () => {
    const state = get();
    const now = Date.now();
    if (getPointResetReason(state, now)) return false;
    set({
      balance: POINT_RESET_BALANCE,
      lastResetAt: now,
      resetReceipt: { previousBalance: state.balance, balance: POINT_RESET_BALANCE, resetAt: now },
    });
    return true;
  },
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
