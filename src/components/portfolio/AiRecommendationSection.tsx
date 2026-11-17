import { Pressable, Text, View } from 'react-native';

import { formatPoint } from '@/utils/formatNumber';

type RecommendedProduct = {
  name: string;
  category: string;
  price: number;
  reason: string;
  badgeClassName: string;
};

type AiRecommendationSectionProps = {
  products: RecommendedProduct[];
  onProductPress: (name: string) => void;
};

export function AiRecommendationSection({
  products,
  onProductPress,
}: AiRecommendationSectionProps) {
  return (
    <View>
      <Text
        accessibilityRole="header"
        className="font-pretendard-bold text-[13px] leading-[19.5px] text-motu-black text-no-font-padding"
      >
        AI 상품 추천
      </Text>
      <Text className="mt-[4px] font-pretendard text-[11px] leading-[17.875px] text-motu-grey text-no-font-padding">
        내 포트폴리오와 관심 분야를 기반으로 추천한 상품이에요.
      </Text>

      <View className="mt-[12px] gap-[8px]">
        {products.map(({ name, category, price, reason, badgeClassName }) => (
          <Pressable
            key={name}
            accessibilityRole="button"
            accessibilityHint="상품 이름으로 검색해요."
            onPress={() => onProductPress(name)}
            className="gap-[8px] rounded-[12px] border border-motu-grey-lighter bg-motu-surface-card px-[17px] py-[12px] active:opacity-80"
          >
            <View className="flex-row items-center gap-[12px]">
              <View
                accessible={false}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                className={`h-[36px] w-[36px] items-center justify-center rounded-full ${badgeClassName}`}
              >
                <Text className="font-pretendard-bold text-[13px] leading-[13px] text-motu-on-cta text-no-font-padding">
                  {name.charAt(0)}
                </Text>
              </View>
              <View className="min-w-0 flex-1 gap-[2px]">
                <Text
                  numberOfLines={1}
                  className="font-pretendard-semibold text-[13px] leading-[19.5px] text-motu-black text-no-font-padding"
                >
                  {name}
                </Text>
                <Text className="font-pretendard text-[11px] leading-[16.5px] text-motu-grey text-no-font-padding">
                  {category}
                </Text>
              </View>
              <Text className="font-pretendard-semibold text-[12px] leading-[18px] tracking-[-0.24px] text-motu-black text-no-font-padding">
                {formatPoint(price)}
              </Text>
            </View>
            <Text className="font-pretendard text-[11px] leading-[17.875px] text-motu-grey text-no-font-padding">
              {reason}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
