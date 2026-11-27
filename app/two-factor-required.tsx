import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View, Pressable } from 'react-native';
import { MySettingsLayout } from '@/components/my/MySettingsLayout';
import { TwoFactorRequiredToast } from '@/components/twoFactorSession/TwoFactorRequiredToast';

export default function TwoFactorRequiredScreen() {
  const { intent } = useLocalSearchParams<{ intent?: string }>();
  const handleBack = () => (router.canGoBack() ? router.back() : router.replace('/my'));
  return (
    <MySettingsLayout
      title="2차 보안"
      onBack={handleBack}
      overlay={<TwoFactorRequiredToast />}
      footer={
        <View className="border-t border-motu-grey-lighter bg-motu-surface-card px-[24px] pb-[24px] pt-[17px]">
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/two-factor-verify', params: { intent } })}
            className="h-[49px] items-center justify-center rounded-[12px] bg-motu-black"
          >
            <Text className="font-pretendard-bold text-[14px] leading-[21px] text-motu-on-cta text-no-font-padding">
              2차 보안 설정하기
            </Text>
          </Pressable>
        </View>
      }
    >
      <View className="items-center rounded-[16px] border border-motu-grey-lighter bg-motu-surface-card px-[20px] py-[24px]">
        <View className="h-[56px] w-[56px] items-center justify-center rounded-full bg-motu-grey-lighter">
          <Image
            source={require('../assets/icons/twoFactorSession/shieldOff.svg')}
            className="h-[26px] w-[26px]"
            contentFit="contain"
            accessible={false}
          />
        </View>
        <View className="mt-[12px] w-[64px] items-center rounded-full bg-motu-red/10 py-[4px]">
          <Text className="font-pretendard-semibold text-[11px] leading-[16.5px] text-motu-red text-no-font-padding">
            미설정
          </Text>
        </View>
        <Text className="mt-[12px] text-center font-pretendard-bold text-[16px] leading-[22px] text-motu-black text-no-font-padding">
          {'이 기능을 사용하려면\n2차 보안 설정이 필요해요'}
        </Text>
        <Text className="mt-[8px] text-center font-pretendard text-[12.5px] leading-[20.313px] text-motu-grey text-no-font-padding">
          {'주문, 출금, 상장 신청은 등록한 휴대폰으로\n한 번 더 인증한 뒤 이용할 수 있어요.'}
        </Text>
      </View>
    </MySettingsLayout>
  );
}
