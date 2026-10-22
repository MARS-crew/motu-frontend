import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryChip } from '@/components/CategoryChip';
import { TabHeader } from '@/components/TabHeader';
import { MarketSortDropdown } from '@/components/market/MarketSortDropdown';
import { ProductListItem } from '@/components/ProductListItem';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { MARKET_CATEGORIES, MARKET_PRODUCTS, MARKET_SORT_OPTIONS } from '@/constants/marketPreview';
import type { MarketProduct, MarketSort } from '@/types/product';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

// 이 높이 이상 내려가면 맨 위로 이동 버튼을 보여 줍니다.
const SCROLL_TO_TOP_VISIBLE_OFFSET = 300;

// 서버 연동 시 카테고리·정렬 값을 API 파라미터로 넘기고, 응답 순서를 그대로 사용합니다
const sortProducts = (products: MarketProduct[], sort: MarketSort) => {
  const sorted = [...products];
  switch (sort) {
    case 'rateDesc':
      return sorted.sort((a, b) => b.changeRate - a.changeRate);
    case 'rateAsc':
      return sorted.sort((a, b) => a.changeRate - b.changeRate);
    case 'volume':
      return sorted.sort((a, b) => b.volume - a.volume);
    case 'listedAt':
      return sorted.sort((a, b) => b.listedAt.localeCompare(a.listedAt));
    default:
      return sorted.sort((a, b) => b.tradeAmount - a.tradeAmount);
  }
};

export default function MarketScreen() {
  const { isScrolled, handleScroll: handleHeaderScroll } = useHeaderScroll();
  const scrollRef = useRef<ScrollView>(null);
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(MARKET_CATEGORIES[0]);
  const [sort, setSort] = useState<MarketSort>('tradeAmount');
  const [products, setProducts] = useState(MARKET_PRODUCTS);

  const visibleProducts = sortProducts(
    selectedCategory === '전체'
      ? products
      : products.filter((product) => product.category === selectedCategory),
    sort,
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleHeaderScroll(event);
    setIsScrollToTopVisible(event.nativeEvent.contentOffset.y > SCROLL_TO_TOP_VISIBLE_OFFSET);
  };

  const handleScrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: true });

  const handleSearchPress = () => router.push('/search');

  const handleFavoritePress = () => router.push('/favorites');

  const handleProductPress = (id: number) =>
    router.push({ pathname: '/product/[id]', params: { id: String(id) } });

  const handleProductFavoritePress = (id: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, isFavorite: !product.isFavorite } : product,
      ),
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-motu-bg">
      <TabHeader
        title="상품 목록"
        isScrolled={isScrolled}
        onSearchPress={handleSearchPress}
        onFavoritePress={handleFavoritePress}
      />

      <View className="flex-1">
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="pb-6"
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-6 pb-3"
          >
            {MARKET_CATEGORIES.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                isSelected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
              />
            ))}
          </ScrollView>

          <View className="z-10 px-6 pb-3 pt-1">
            <MarketSortDropdown
              options={MARKET_SORT_OPTIONS}
              value={sort}
              onValueChange={setSort}
            />
          </View>

          <View className="px-6 pt-2">
            {visibleProducts.length > 0 ? (
              <View className="gap-2">
                {visibleProducts.map((product, index) => (
                  <ProductListItem
                    key={product.id}
                    product={product}
                    rank={index + 1}
                    onPress={() => handleProductPress(product.id)}
                    onFavoritePress={() => handleProductFavoritePress(product.id)}
                  />
                ))}
              </View>
            ) : (
              <Text className="pt-20 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
                해당 카테고리의 상품이 없습니다.
              </Text>
            )}
          </View>
        </ScrollView>

        {isScrollToTopVisible && (
          <View className="absolute bottom-6 right-6">
            <ScrollToTopButton onPress={handleScrollToTop} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
