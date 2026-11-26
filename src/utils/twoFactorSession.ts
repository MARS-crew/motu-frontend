import type { Href } from 'expo-router';
import { twoFactorIntentSchema, type TwoFactorIntent } from '@/schemas/twoFactorSessionSchema';

export function parseTwoFactorIntent(value: string | undefined) {
  try {
    const result = twoFactorIntentSchema.safeParse(JSON.parse(value ?? 'null'));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
export function getTwoFactorReturnRoute(intent: TwoFactorIntent | null, resumeAction = true): Href {
  if (!intent) return '/my';
  if (intent.kind === 'login') {
    if (intent.returnTo) return intent.returnTo;
    return intent.stockId
      ? { pathname: '/product/[id]', params: { id: String(intent.stockId) } }
      : '/(tabs)';
  }
  if (intent.kind === 'phone-change')
    return {
      pathname: '/two-factor-verify',
      params: intent.returnIntent ? { intent: intent.returnIntent } : {},
    };
  if (intent.kind === 'order')
    return {
      pathname: '/product/[id]',
      params: {
        id: String(intent.stockId),
        ...(resumeAction ? { securityResume: intent.side } : {}),
      },
    };
  return {
    pathname: intent.origin ?? intent.pathname,
    params: intent.draftId ? { draftId: intent.draftId } : {},
  };
}
export function hasCurrentTwoFactorSession(verifiedUntil: string | null, now = Date.now()) {
  return verifiedUntil !== null && Date.parse(verifiedUntil) > now;
}

export function getTwoFactorSecondsUntil(timestamp: string | undefined, now: number) {
  return timestamp ? Math.max(0, Math.ceil((Date.parse(timestamp) - now) / 1000)) : 0;
}

export function getTwoFactorReason(intent: TwoFactorIntent | null) {
  if (intent?.kind === 'login') return '새 기기 로그인을 완료하려면 인증해 주세요.';
  if (intent?.kind === 'phone-change') return '2차 보안 등록 번호 변경을 완료하려면 인증해 주세요.';
  if (intent?.kind === 'order') return '주문 최초 활성화를 완료하려면 인증해 주세요.';
  if (intent?.kind === 'listing' && intent.pathname === '/listing-application/review')
    return '상장 최종 제출을 완료하려면 인증해 주세요.';
  return '상장 신청을 완료하려면 인증해 주세요.';
}
