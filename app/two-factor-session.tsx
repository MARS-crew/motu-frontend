import { Image } from 'expo-image';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import { AuthFlowLayout, AuthFlowHeading } from '@/components/login/AuthFlowLayout';
import { Button } from '@/components/Button';
import { RegisteredPhoneField } from '@/components/twoFactorSession/RegisteredPhoneField';
import { TextField } from '@/components/TextField';
import { formatEmailCodeTime } from '@/hooks/useEmailCodeTimer';
import { useLoginTwoFactorSession } from '@/hooks/useLoginTwoFactorSession';
import { useTwoFactorSession } from '@/hooks/useTwoFactorSession';
import {
  getTwoFactorReturnRoute,
  parseTwoFactorIntent,
  getTwoFactorReason,
} from '@/utils/twoFactorSession';
import { tokenStorage } from '@/utils/tokenStorage';

export default function TwoFactorSessionScreen() {
  const { intent: rawIntent } = useLocalSearchParams<{ intent?: string }>();
  const intent = parseTwoFactorIntent(rawIntent);
  return intent?.kind === 'login' ? (
    <LoginSessionContent rawIntent={rawIntent} />
  ) : (
    <AccountSessionContent rawIntent={rawIntent} />
  );
}
function LoginSessionContent({ rawIntent }: { rawIntent?: string }) {
  const session = useLoginTwoFactorSession();
  if (session.isLoginChallengeInvalid) return <Redirect href="/login" />;
  return <TwoFactorSessionContent session={session} rawIntent={rawIntent} />;
}
function AccountSessionContent({ rawIntent }: { rawIntent?: string }) {
  const session = useTwoFactorSession();
  return <TwoFactorSessionContent session={session} rawIntent={rawIntent} />;
}
function TwoFactorSessionContent({
  session,
  rawIntent,
}: {
  session: ReturnType<typeof useTwoFactorSession> | ReturnType<typeof useLoginTwoFactorSession>;
  rawIntent?: string;
}) {
  const intent = parseTwoFactorIntent(rawIntent);
  const { isComplete } = session;
  useEffect(() => {
    if (!isComplete) return;
    const sessionId = tokenStorage.getSessionId();
    const timeout = setTimeout(() => {
      if (sessionId === tokenStorage.getSessionId())
        router.dismissTo(getTwoFactorReturnRoute(parseTwoFactorIntent(rawIntent)));
    }, 1200);
    return () => clearTimeout(timeout);
  }, [isComplete, rawIntent]);
  const handleBack = () => (router.canGoBack() ? router.back() : router.replace('/my'));
  const isState = session.isComplete || session.isLocked || session.isExpired;
  const icon = session.isComplete
    ? require('../assets/icons/twoFactorSession/check.svg')
    : session.isLocked
      ? require('../assets/icons/twoFactorSession/lock.svg')
      : require('../assets/icons/twoFactorSession/clock.svg');
  return (
    <AuthFlowLayout title="2차 보안" onBack={handleBack}>
      {isState ? (
        <>
          <View className="h-[56px] w-[56px] items-center justify-center rounded-full bg-motu-bg-secondary">
            <Image
              source={icon}
              className={
                session.isExpired && !session.isComplete && !session.isLocked
                  ? 'h-[22px] w-[22px]'
                  : session.isLocked && !session.isComplete
                    ? 'h-[17px] w-[17px]'
                    : 'h-[22px] w-[22px]'
              }
              contentFit="contain"
              accessible={false}
            />
          </View>
          <AuthFlowHeading
            title={
              session.isComplete
                ? '인증이 완료되었습니다.'
                : session.isLocked
                  ? '잠시 후 다시 시도해 주세요'
                  : '인증번호가 만료되었습니다'
            }
            description={
              session.isComplete
                ? undefined
                : session.isLocked
                  ? '인증번호를 5회 연속\n잘못 입력했습니다.'
                  : '유효시간 5분이 지났습니다.\n새 인증번호를 받아 다시 진행해 주세요.'
            }
          />
          {session.isComplete ? (
            <>
              <Text className="-mt-[14px] font-pretendard-medium text-[14px] leading-[20px] text-motu-text-secondary text-no-font-padding">
                {'등록한 휴대폰으로\n본인 확인을 마쳤습니다.'}
              </Text>
              <View className="flex-row items-center gap-[8px] rounded-[14px] border border-motu-border bg-motu-surface-card p-[16px]">
                <Text className="flex-1 font-pretendard-medium text-[13px] leading-[18px] text-motu-text-tertiary text-no-font-padding">
                  인증 휴대폰
                </Text>
                <Text className="font-pretendard-bold text-[15px] leading-[20px] text-motu-text-primary text-no-font-padding">
                  {session.maskedPhoneNumber}
                </Text>
              </View>
            </>
          ) : session.isLocked ? (
            <>
              <View className="rounded-[10px] bg-motu-red-light px-[14px] py-[12px]">
                <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-btn-red text-no-font-padding">
                  2차 보안 인증 · 30분 제한
                </Text>
              </View>
              <Text className="font-pretendard-medium text-[12px] leading-[20px] text-motu-text-tertiary text-no-font-padding">
                계정 전체는 잠기지 않습니다.
              </Text>
              <View className="flex-1" />
              <Button appearance="auth" title="확인" onPress={handleBack} />
            </>
          ) : (
            <>
              <View className="flex-1" />
              <View className="gap-[12px]">
                <Text className="text-center font-pretendard-medium text-[12px] leading-[20px] text-motu-text-tertiary text-no-font-padding">
                  이전 인증번호는 사용할 수 없습니다.
                </Text>
                <Button
                  appearance="auth"
                  title="인증번호 다시 받기"
                  disabled={session.isPending || session.resendRemaining > 0}
                  onPress={() => void session.handleSend()}
                />
              </View>
            </>
          )}
        </>
      ) : (
        <>
          <View className="rounded-[10px] bg-motu-bg-secondary px-[14px] py-[12px]">
            <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-text-secondary text-no-font-padding">
              {getTwoFactorReason(intent)}
            </Text>
          </View>
          <AuthFlowHeading title="휴대폰으로 인증합니다." />
          <View className="gap-[16px]">
            <RegisteredPhoneField
              label={session.failure === 'mismatch' ? '등록 휴대폰' : '2차 보안 인증 휴대폰'}
              value={session.maskedPhoneNumber}
            />
            <Button
              appearance="auth"
              title={
                !session.send.data
                  ? '인증번호 보내기'
                  : session.resendRemaining > 0
                    ? `인증번호 재발송 (${formatEmailCodeTime(session.resendRemaining)})`
                    : '인증번호 재발송'
              }
              disabled={
                session.isPending ||
                session.resendRemaining > 0 ||
                !session.maskedPhoneNumber ||
                !session.canSend
              }
              onPress={() => void session.handleSend()}
            />
            {session.send.data && (
              <>
                <Controller
                  control={session.form.control}
                  name="code"
                  render={({ field: { value, onChange, onBlur, ref } }) => (
                    <TextField
                      variant="auth"
                      label="인증번호"
                      inputRef={ref}
                      value={value}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="6자리 숫자"
                      editable={!session.isPending}
                      onBlur={onBlur}
                      hasMessageSpace={false}
                      onChangeText={(text) => {
                        session.clearFailure();
                        onChange(text.replace(/\D/g, '').slice(0, 6));
                      }}
                    />
                  )}
                />
                <View className="-mt-[8px] min-h-[68px] gap-[4px]">
                  {session.failure === 'mismatch' && session.remainingAttempts !== undefined && (
                    <Text
                      accessibilityLiveRegion="polite"
                      className="font-pretendard-medium text-[12px] leading-[20px] text-motu-btn-red text-no-font-padding"
                    >
                      인증번호가 일치하지 않습니다.
                    </Text>
                  )}
                  {session.failure === 'mismatch' && session.remainingAttempts !== undefined && (
                    <Text className="font-pretendard-medium text-[12px] leading-[20px] text-motu-text-tertiary text-no-font-padding">
                      남은 시도 횟수 {session.remainingAttempts}회
                    </Text>
                  )}
                  <Text className="font-pretendard-medium text-[12px] leading-[20px] text-motu-text-tertiary text-no-font-padding">
                    남은 시간 {formatEmailCodeTime(session.remaining)}
                  </Text>
                  {session.failure !== 'mismatch' && session.remainingAttempts !== undefined && (
                    <Text className="font-pretendard-medium text-[12px] leading-[20px] text-motu-text-tertiary text-no-font-padding">
                      남은 시도 횟수 {session.remainingAttempts}회
                    </Text>
                  )}
                </View>
              </>
            )}
            {session.serverMessage && (
              <Text
                accessibilityLiveRegion="polite"
                className="font-pretendard-medium text-[12px] leading-[20px] text-motu-btn-red text-no-font-padding"
              >
                {session.serverMessage}
              </Text>
            )}
          </View>
          <View className="flex-1" />
          {session.send.data && (
            <Text className="min-h-[20px] flex-1 text-center font-pretendard-medium text-[12px] leading-[20px] text-motu-text-tertiary text-no-font-padding">
              등록 번호를 사용할 수 없나요?{'  '}
              <Text
                accessibilityRole="link"
                onPress={() => router.push('/account-inquiry')}
                className="text-motu-text-primary underline"
              >
                문의하기
              </Text>
            </Text>
          )}
          {session.send.data && (
            <Button
              appearance="auth"
              title={session.failure === 'mismatch' ? '다시 입력' : '인증 확인'}
              disabled={session.isPending || session.code.length !== 6}
              onPress={session.handleConfirm}
            />
          )}
        </>
      )}
    </AuthFlowLayout>
  );
}
