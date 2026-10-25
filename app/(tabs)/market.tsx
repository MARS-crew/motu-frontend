import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { MARKET_SORT_OPTIONS } from '@/constants/market';
import { useSectorsQuery } from '@/queries/useSectorsQuery';
import { useStocksQuery } from '@/queries/useStocksQuery';
import { useWishlistMutation } from '@/queries/useWishlistMutation';
import { useAuthStore } from '@/stores/useAuthStore';
import type { MarketSort, Product } from '@/types/product';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { isNearBottom } from '@/utils/scroll';

// 이 높이 이상 내려가면 맨 위로 이동 버튼을 보여 줍니다.
const SCROLL_TO_TOP_VISIBLE_OFFSET = 300;

export default function MarketScreen() {
  const { isScrolled, handleScroll: handleHeaderScroll } = useHeaderScroll();
  const scrollRef = useRef<ScrollView>(null);
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  // null이면 전체 카테고리입니다.
  const [selectedSectorCode, setSelectedSectorCode] = useState<number | null>(null);
  const [sort, setSort] = useState<MarketSort>('TRADE_AMOUNT');
  const { data: sectors = [] } = useSectorsQuery();
  // 서버가 카테고리·정렬을 적용한 순서를 그대로 보여줍니다.
  const {
    data: products = [],
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useStocksQuery({ sectorCode: selectedSectorCode, sort });
  const { mutate: toggleWishlist } = useWishlistMutation();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleHeaderScroll(event);
    setIsScrollToTopVisible(event.nativeEvent.contentOffset.y > SCROLL_TO_TOP_VISIBLE_OFFSET);
    if (isNearBottom(event) && hasNextPage && !isFetchingNextPage) void fetchNextPage();
  };

  const handleScrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: true });

  const handleSearchPress = () => router.push('/search');

  const handleFavoritePress = () => router.push('/favorites');

  const handleProductPress = (id: number) =>
    router.push({ pathname: '/product/[id]', params: { id: String(id) } });

  // 관심 상품은 회원만 등록할 수 있어 비회원은 로그인 화면으로 보냅니다.
  const handleProductFavoritePress = (product: Product) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    toggleWishlist({ stockId: product.id, isWishlisted: product.isFavorite });
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
            <CategoryChip
              label="전체"
              isSelected={selectedSectorCode === null}
              onPress={() => setSelectedSectorCode(null)}
            />
            {sectors.map(({ sectorCode, sectorName }) => (
              <CategoryChip
                key={sectorCode}
                label={sectorName}
                isSelected={selectedSectorCode === sectorCode}
                onPress={() => setSelectedSectorCode(sectorCode)}
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
            {isPending ? (
              <ActivityIndicator className="pt-20" />
            ) : isError ? (
              <Text className="pt-20 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
                상품 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
              </Text>
            ) : products.length > 0 ? (
              <View className="gap-2">
                {products.map((product, index) => (
                  <ProductListItem
                    key={product.id}
                    product={product}
                    rank={index + 1}
                    onPress={() => handleProductPress(product.id)}
                    onFavoritePress={() => handleProductFavoritePress(product)}
                  />
                ))}
                {isFetchingNextPage && <ActivityIndicator className="py-4" />}
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
