import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/TopBar';

const PREVIEW_POINT_BALANCE = 2345678;

export default function AssetManagementScreen() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/portfolio');
    }
  };

  const handlePointGrant = () => {};

  const handlePointReset = () => {};

  return (
    <SafeAreaView className="bg-motu-bg flex-1">
      <TopBar title="자산관리" onBack={handleBack} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-3 px-6 pt-2">
          <View className="rounded-xl border border-motu-grey-lighter bg-white p-4">
            <Text className="font-inter text-xs text-motu-grey">보유 포인트</Text>
            <Text className="mt-2 font-inter text-[11px] text-motu-grey">예수금</Text>
            <Text className="mt-1 font-inter-bold text-[22px] text-motu-black">
              {PREVIEW_POINT_BALANCE.toLocaleString('ko-KR')} P
            </Text>
          </View>

          <Text
            accessibilityRole="header"
            className="mt-3 font-inter-bold text-[13px] text-motu-black"
          >
            포인트 처리 선택
          </Text>

          <View className="rounded-xl border border-motu-grey-lighter bg-white px-4 pb-[19px] pt-[21px]">
            <Text className="font-inter-bold text-sm text-motu-black">포인트 추가 지급</Text>
            <Text className="mt-2 font-inter text-xs leading-6 text-motu-grey">
              모의투자 포인트를 추가로 지급받아 거래에 활용합니다. 지급 조건과 처리 결과는 다음
              화면에서 안내합니다.
            </Text>
            <Text className="mt-3 font-inter text-[11px] leading-5 text-motu-grey-light">
              유의사항: 실제 자산 또는 수익과 무관한 모의투자 전용 포인트입니다.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handlePointGrant}
              className="mt-4 min-h-11 items-center justify-center rounded-xl bg-motu-black py-4 active:opacity-50"
            >
              <Text className="text-center font-inter-bold text-[13px] text-white">
                포인트 추가 지급 신청
              </Text>
            </Pressable>
          </View>
          <View className="rounded-xl border border-motu-grey-lighter bg-white px-4 pb-[19px] pt-[21px]">
            <Text className="font-inter-bold text-sm text-motu-black">포인트 리셋</Text>
            <Text className="mt-2 font-inter text-xs leading-6 text-motu-grey">
              보유 포인트와 거래 내역을 초기 상태로 되돌립니다. 리셋 조건과 처리 결과는 다음
              화면에서 안내합니다.
            </Text>
            <Text className="mt-3 font-inter text-[11px] leading-5 text-motu-grey-light">
              유의사항: 리셋 후 포인트와 거래 기록은 복구되지 않습니다.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handlePointReset}
              className="bg-motu-btn-red mt-5 min-h-11 items-center justify-center rounded-xl py-4 active:opacity-50"
            >
              <Text className="text-center font-inter-bold text-[13px] text-white">
                포인트 리셋 신청
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
