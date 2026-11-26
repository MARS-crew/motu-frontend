import { skipToken, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTwoFactorQuery } from '@/queries/useTwoFactorQuery';
import {
  getTwoFactorDeliveryKey,
  useSendTwoFactorSessionMutation,
  useConfirmTwoFactorSessionMutation,
} from '@/queries/useTwoFactorSessionMutation';
import {
  twoFactorCodeSchema,
  type TwoFactorCodeForm,
  type TwoFactorDelivery,
} from '@/schemas/twoFactorSessionSchema';
import { getAuthError } from '@/utils/authError';
import { getTwoFactorSecondsUntil } from '@/utils/twoFactorSession';
import { useAuthStore } from '@/stores/useAuthStore';
import { tokenStorage } from '@/utils/tokenStorage';

export function useTwoFactorSession() {
  const status = useTwoFactorQuery();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const send = useSendTwoFactorSessionMutation();
  const confirm = useConfirmTwoFactorSessionMutation();
  const [now, setNow] = useState(Date.now);
  const [failure, setFailure] = useState<'mismatch' | 'expired' | 'locked' | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const lock = useRef(false);
  const [initialSessionId] = useState(tokenStorage.getSessionId);
  // 재발송 실패가 기존 인증번호의 만료 시각과 입력 화면을 지우지 않게 합니다.
  const delivery = useQuery<TwoFactorDelivery>({
    queryKey: getTwoFactorDeliveryKey(initialSessionId),
    queryFn: skipToken,
    gcTime: 0,
  });
  const hasSameSession = isLoggedIn && initialSessionId === tokenStorage.getSessionId();
  const form = useForm<TwoFactorCodeForm>({
    resolver: zodResolver(twoFactorCodeSchema),
    defaultValues: { code: '' },
  });
  const code = useWatch({ control: form.control, name: 'code' });
  useEffect(() => {
    if (!delivery.data && !status.data?.lockedUntil) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [delivery.data, status.data?.lockedUntil]);
  const remaining = getTwoFactorSecondsUntil(delivery.data?.expiresAt, now);
  const resendRemaining = getTwoFactorSecondsUntil(delivery.data?.resendAvailableAt, now);
  const isLocked =
    failure === 'locked' ||
    Boolean(status.data?.lockedUntil && Date.parse(status.data.lockedUntil) > now);
  const isExpired = failure === 'expired' || Boolean(delivery.data && remaining === 0);
  const isComplete = confirm.isSuccess && hasSameSession;
  const handleError = async (error: unknown) => {
    const code = getAuthError(error)?.code;
    if (code === 'VERIFICATION_CODE_MISMATCH') setFailure('mismatch');
    else if (code === 'VERIFICATION_EXPIRED') setFailure('expired');
    else if (code === 'TWO_FACTOR_LOCKED') setFailure('locked');
    else setServerMessage(getAuthError(error)?.message ?? null);
    if (isAxiosError(error) && error.response) await status.refetch();
  };
  const handleSend = async () => {
    if (
      !useAuthStore.getState().isLoggedIn ||
      lock.current ||
      isLocked ||
      resendRemaining > 0 ||
      initialSessionId !== tokenStorage.getSessionId()
    )
      return;
    lock.current = true;
    try {
      await send.mutateAsync();
      setFailure(null);
      setServerMessage(null);
      form.reset({ code: '' });
      setNow(Date.now());
    } catch (error) {
      await handleError(error);
    } finally {
      lock.current = false;
    }
  };
  const handleConfirm = () => {
    void form.handleSubmit(async (body) => {
      if (
        !useAuthStore.getState().isLoggedIn ||
        lock.current ||
        isLocked ||
        isExpired ||
        !delivery.data ||
        initialSessionId !== tokenStorage.getSessionId()
      )
        return;
      lock.current = true;
      try {
        await confirm.mutateAsync(body);
        setServerMessage(null);
      } catch (error) {
        await handleError(error);
      } finally {
        lock.current = false;
      }
    })();
  };
  return {
    status,
    canSend: hasSameSession && status.data?.status === 'ENABLED',
    form,
    code,
    send: { ...send, data: hasSameSession ? delivery.data : undefined },
    confirm,
    failure,
    serverMessage,
    remaining,
    resendRemaining,
    isLocked,
    isExpired,
    isComplete,
    isPending: send.isPending || confirm.isPending,
    handleSend,
    handleConfirm,
    remainingAttempts: status.data?.remainingAttempts ?? delivery.data?.remainingAttempts,
    maskedPhoneNumber: hasSameSession
      ? (delivery.data?.maskedPhoneNumber ?? status.data?.maskedPhoneNumber ?? '')
      : '',
    clearFailure: () => {
      setFailure(null);
      setServerMessage(null);
    },
  };
}
