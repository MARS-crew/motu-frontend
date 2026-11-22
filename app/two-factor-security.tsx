import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { MySettingsLayout } from '@/components/my/MySettingsLayout';
import { SecondFactorReleaseModal } from '@/components/my/SecondFactorReleaseModal';
import { useTwoFactorQuery } from '@/queries/useTwoFactorQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatTwoFactorDate, getTwoFactorEnabled } from '@/utils/twoFactor';

export default function TwoFactorSecurityScreen() {
  const [isReleaseVisible, setIsReleaseVisible] = useState(false);
  const query = useTwoFactorQuery();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const status = isLoggedIn && !query.isError ? query.data : undefined;
  const isEnabled = getTwoFactorEnabled(status?.status);
  const hasStatus = status !== undefined;

  return (
    <MySettingsLayout
      title="2차 보안"
      onBack={() => router.dismissTo('/my')}
      footer={
        <View className="border-t border-motu-grey-lighter bg-motu-surface-card px-[24px] pb-[22px] pt-[16px]">
          <Button
            appearance="auth"
            title={!hasStatus ? '2차 보안' : isEnabled ? '2차 보안 해제' : '2차 보안 설정하기'}
            disabled={!hasStatus}
            variant={isEnabled ? 'secondary' : 'primary'}
            onPress={
              isEnabled ? () => setIsReleaseVisible(true) : () => router.push('/two-factor-verify')
            }
          />
        </View>
      }
    >
      <View className="gap-[16px]">
        <View className="min-h-[225px] items-center justify-center gap-[12px] rounded-[16px] border border-motu-grey-lighter bg-motu-surface-card px-[21px] py-[24px]">
          {hasStatus && (
            <>
              <View
                className={`h-[56px] w-[56px] items-center justify-center rounded-full ${isEnabled ? 'bg-motu-green/10' : 'bg-motu-grey-lighter'}`}
              >
                <Image
                  source={
                    isEnabled
                      ? require('../assets/icons/my/security/shieldOn.svg')
                      : require('../assets/icons/my/security/shieldOff.svg')
                  }
                  className="h-[26px] w-[26px]"
                  contentFit="contain"
                  accessible={false}
                />
              </View>
              <View
                className={`min-w-[64px] items-center rounded-full px-[8px] py-[4px] ${isEnabled ? 'bg-motu-green/10' : 'bg-motu-red/10'}`}
              >
                <Text
                  className={`font-pretendard-semibold text-[11px] leading-[16.5px] text-no-font-padding ${isEnabled ? 'text-motu-green' : 'text-motu-red'}`}
                >
                  {isEnabled ? '사용 중' : '미설정'}
                </Text>
              </View>
              <View className="gap-[6px]">
                <Text className="text-center font-pretendard-bold text-[16px] leading-[24px] text-motu-black text-no-font-padding">
                  {isEnabled ? '2차 보안 사용 중' : '2차 보안이 아직 설정되지 않았어요'}
                </Text>
                <Text className="text-center font-pretendard text-[13px] leading-[20px] text-motu-grey text-no-font-padding">
                  {isEnabled
                    ? '중요한 작업을 할 때 등록한 휴대폰으로 인증합니다.'
                    : '2차 보안을 설정하면 중요한 작업을 할 때\n등록한 휴대폰으로 한 번 더 인증해요.'}
                </Text>
              </View>
            </>
          )}
        </View>
        {isEnabled && (
          <View className="gap-[14px] rounded-[16px] border border-motu-grey-lighter bg-motu-surface-card px-[21px] py-[20px]">
            {[
              ['등록 휴대폰', status?.maskedPhoneNumber ?? ''],
              ['설정일시', formatTwoFactorDate(status?.enabledDate)],
              ['최근 인증', formatTwoFactorDate(status?.lastVerifiedDate)],
            ].map(([label, value]) => (
              <View key={label} className="flex-row justify-between gap-[8px]">
                <Text className="font-pretendard text-[13px] leading-[21px] text-motu-grey text-no-font-padding">
                  {label}
                </Text>
                <Text className="font-pretendard-semibold text-[13px] leading-[21px] text-motu-black text-no-font-padding">
                  {value}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      {isReleaseVisible && <SecondFactorReleaseModal onClose={() => setIsReleaseVisible(false)} />}
    </MySettingsLayout>
  );
}
