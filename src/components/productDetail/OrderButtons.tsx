import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type OrderButtonsProps = {
  onSellPress: () => void;
  onBuyPress: () => void;
};

export function OrderButtons({ onSellPress, onBuyPress }: OrderButtonsProps) {
  return (
    <SafeAreaView edges={['bottom']} className="border-t border-motu-grey-lighter bg-white">
      <View className="flex-row gap-2 px-6 pb-4 pt-[13px]">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="지정가 매도"
          onPress={onSellPress}
          className="h-[52px] flex-1 items-center justify-center rounded-xl bg-motu-blue active:opacity-80"
        >
          <Text className="font-pretendard-bold text-sm leading-[18px] text-white">매도</Text>
          <Text className="font-pretendard-medium text-[11px] leading-[14px] text-white/80">
            지정가
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="지정가 매수"
          onPress={onBuyPress}
          className="h-[52px] flex-1 items-center justify-center rounded-xl bg-motu-red active:opacity-80"
        >
          <Text className="font-pretendard-bold text-sm leading-[18px] text-white">매수</Text>
          <Text className="font-pretendard-medium text-[11px] leading-[14px] text-white/80">
            지정가
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
