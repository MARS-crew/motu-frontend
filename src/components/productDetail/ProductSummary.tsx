import { Text, View } from 'react-native';

import type { ProductDetail } from '@/types/product';
import { formatPoint } from '@/utils/formatNumber';

type ProductSummaryProps = {
  product: ProductDetail;
};

export function ProductSummary({ product }: ProductSummaryProps) {
  return (
    <View className="px-6 pt-0.5">
      <View className="flex-row items-center gap-2">
        {/* 종목별 색상은 서버 데이터라 style로 지정하고, 한글이 위로 치우쳐 보여서 위 패딩으로 가운데를 맞춥니다. */}
        <View
          className="h-6 w-6 items-center justify-center rounded-full pt-0.5"
          style={{ backgroundColor: product.color }}
        >
          <Text className="font-pretendard-semibold text-[11px] leading-[14px] text-white">
            {product.name.charAt(0)}
          </Text>
        </View>
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          className="flex-shrink font-pretendard-bold text-lg leading-6 text-motu-black"
        >
          {product.name}
        </Text>
        <View className="rounded-full bg-motu-grey-lighter px-2 pb-[1.1px] pt-[2.9px]">
          <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
            {product.category}
          </Text>
        </View>
      </View>
      <Text className="pt-0.5 font-pretendard-medium text-xs leading-4 text-motu-grey">
        {product.description}
      </Text>
      <Text className="pt-1.5 font-pretendard-bold text-2xl leading-8 text-motu-black">
        {formatPoint(product.price)}
      </Text>
      <Text
        className={`pt-1.5 font-pretendard-bold text-[13px] leading-[18px] ${
          product.isTradable ? 'text-motu-green' : 'text-motu-grey'
        }`}
      >
        {product.isTradable ? '거래 가능' : '거래 불가'}
      </Text>
    </View>
  );
}
