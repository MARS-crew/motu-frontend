import { useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useLoginChallengeQuery,
  useLoginDeliveryQuery,
  useSendLoginVerificationMutation,
  useConfirmLoginVerificationMutation,
} from '@/queries/useLoginVerificationMutation';
import { twoFactorCodeSchema, type TwoFactorCodeForm } from '@/schemas/twoFactorSessionSchema';
import { getVerificationTime, useVerificationTimer } from '@/hooks/useVerificationTimer';
import { getAuthError } from '@/utils/authError';

export function useLoginTwoFactorSession() {
  const challenge = useLoginChallengeQuery();
  const delivery = useLoginDeliveryQuery();
  const send = useSendLoginVerificationMutation();
  const confirm = useConfirmLoginVerificationMutation();
  const form = useForm<TwoFactorCodeForm>({
    resolver: zodResolver(twoFactorCodeSchema),
    defaultValues: { code: '' },
  });
  const code = useWatch({ control: form.control, name: 'code' });
  const timer = useVerificationTimer(delivery.data ?? undefined);
  const lock = useRef(false);
  const error = getAuthError(confirm.error ?? send.error);
  const isLocked =
    error?.code === 'TWO_FACTOR_LOCKED' || error?.code === 'VERIFICATION_ATTEMPTS_EXCEEDED';
  const isExpired = timer.hasExpired || error?.code === 'VERIFICATION_EXPIRED';
  const handleSend = async () => {
    if (
      lock.current ||
      isLocked ||
      !challenge.data ||
      challenge.data.method !== 'SMS' ||
      getVerificationTime(delivery.data ?? undefined).resendRemaining > 0
    )
      return;
    lock.current = true;
    confirm.reset();
    try {
      await send.mutateAsync();
      form.reset({ code: '' });
    } catch {
      /* 서버 오류만 표시합니다. */
    } finally {
      lock.current = false;
    }
  };
  const handleConfirm = () => {
    void form.handleSubmit(async ({ code }) => {
      if (
        lock.current ||
        isLocked ||
        !delivery.data ||
        getVerificationTime(delivery.data).hasExpired
      )
        return;
      lock.current = true;
      send.reset();
      try {
        await confirm.mutateAsync(code);
      } catch {
        /* 서버 오류만 표시합니다. */
      } finally {
        lock.current = false;
      }
    })();
  };
  const target = delivery.data ?? challenge.data;
  return {
    isLoginChallengeInvalid:
      !confirm.isSuccess &&
      !confirm.isPending &&
      ((!challenge.isPending && !challenge.data) || error?.code === 'AUTH_INVALID_LOGIN_TOKEN'),
    form,
    code,
    isLocked,
    isExpired,
    isComplete: confirm.isSuccess,
    canSend: challenge.data?.method === 'SMS',
    send: { data: delivery.data ?? undefined },
    isPending: send.isPending || confirm.isPending,
    failure: error?.code === 'VERIFICATION_CODE_MISMATCH' ? ('mismatch' as const) : null,
    serverMessage:
      error &&
      ![
        'VERIFICATION_CODE_MISMATCH',
        'VERIFICATION_EXPIRED',
        'TWO_FACTOR_LOCKED',
        'VERIFICATION_ATTEMPTS_EXCEEDED',
      ].includes(error.code)
        ? (error.message ?? null)
        : null,
    remaining: timer.remaining,
    resendRemaining: timer.resendRemaining,
    remainingAttempts: error ? undefined : (delivery.data?.remainingAttempts ?? undefined),
    maskedPhoneNumber: confirm.data?.maskedTarget ?? target?.maskedTarget ?? '',
    handleSend,
    handleConfirm,
    clearFailure: () => {
      confirm.reset();
      send.reset();
    },
  };
}
