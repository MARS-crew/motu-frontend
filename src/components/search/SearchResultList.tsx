import { ActivityIndicator, Text, View } from 'react-native';

import { ProductListItem } from '@/components/ProductListItem';
import type { Product } from '@/types/product';

type SearchResultListProps = {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  onProductPress: (productId: number) => void;
  onFavoritePress: (product: Product) => void;
};

export function SearchResultList({
  products,
  isLoading,
  isError,
  isFetchingNextPage,
  onProductPress,
  onFavoritePress,
}: SearchResultListProps) {
  const renderBody = () => {
    if (isLoading) {
      return (
        <View className="items-center pt-20">
          <ActivityIndicator />
        </View>
      );
    }

    if (isError) {
      return (
        <Text className="pt-20 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
          검색 결과를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </Text>
      );
    }

    if (products.length === 0) {
      return (
        <Text className="pt-20 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
          검색 결과가 없습니다.
        </Text>
      );
    }

    return (
      <View className="mt-2">
        {products.map((product) => (
          <ProductListItem
            key={product.id}
            product={product}
            onPress={() => onProductPress(product.id)}
            onFavoritePress={() => onFavoritePress(product)}
          />
        ))}
        {isFetchingNextPage && <ActivityIndicator className="py-4" />}
      </View>
    );
  };

  return (
    <View className="px-6 pt-6">
      {/* 서버가 전체 건수를 주지 않아, 지금까지 불러온 결과 수를 표시합니다. */}
      <Text
        accessibilityRole="header"
        className="font-pretendard-bold text-[13px] leading-[18px] text-motu-black"
      >
        검색 결과 {!isLoading && <Text className="text-motu-grey">{products.length}</Text>}
      </Text>

      {renderBody()}
    </View>
  );
}
