import { Text, View } from 'react-native';

import { ProductListItem } from '@/components/ProductListItem';
import type { Product } from '@/types/product';

type SearchResultListProps = {
  products: Product[];
  onFavoritePress: (productId: number) => void;
};

export function SearchResultList({ products, onFavoritePress }: SearchResultListProps) {
  return (
    <View className="px-6 pt-6">
      <Text
        accessibilityRole="header"
        className="font-pretendard-bold text-[13px] leading-[18px] text-motu-black"
      >
        검색 결과 <Text className="text-motu-grey">{products.length}</Text>
      </Text>

      {products.length > 0 ? (
        <View className="mt-2">
          {/* 상품 상세 화면이 추가되면 onPress로 이동을 연결합니다. */}
          {products.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              onFavoritePress={() => onFavoritePress(product.id)}
            />
          ))}
        </View>
      ) : (
        <Text className="pt-20 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
          검색 결과가 없습니다.
        </Text>
      )}
    </View>
  );
}
