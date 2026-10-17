import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import type { Faq } from '@/types/faq';

cssInterop(Image, { className: 'style' });

type FaqItemProps = {
  faq: Faq;
  isExpanded: boolean;
  onPress: () => void;
};

export function FaqItem({ faq, isExpanded, onPress }: FaqItemProps) {
  return (
    <View className="overflow-hidden rounded-2xl border border-motu-grey-lighter bg-white">
      {/* Pretendard 한글이 줄 높이 안에서 위로 치우쳐 보여서 위 패딩을 더 줘 카드 안에서 가운데로 맞춥니다. */}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={onPress}
        className="flex-row items-center gap-3 px-4 pb-[16.2px] pt-[17.8px] active:opacity-80"
      >
        <Text className="font-pretendard-bold text-[13px] leading-[18px] text-motu-red">Q</Text>
        <Text
          numberOfLines={isExpanded ? undefined : 1}
          className="flex-1 font-pretendard-bold text-[13px] leading-[18px] text-motu-black"
        >
          {faq.question}
        </Text>
        <Image
          source={require('../../../assets/icons/faq/chevronDown.svg')}
          contentFit="contain"
          className={`-mt-[1.6px] h-[18px] w-[18px] ${isExpanded ? 'rotate-180' : ''}`}
        />
      </Pressable>

      {isExpanded && (
        <View className="flex-row gap-3 border-t border-motu-grey-lighter bg-motu-grey-lighter/20 p-4">
          <Text className="font-pretendard-bold text-[13px] leading-[18px] text-motu-grey">A</Text>
          <Text className="flex-1 font-pretendard-medium text-xs leading-4 text-motu-grey">
            {faq.answer}
          </Text>
        </View>
      )}
    </View>
  );
}
