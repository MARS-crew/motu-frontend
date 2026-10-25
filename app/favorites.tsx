import { router } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FavoriteEmpty } from '@/components/favorite/FavoriteEmpty';
import { FavoriteProductItem } from '@/components/favorite/FavoriteProductItem';
import { LoginRequiredBox } from '@/components/home/LoginRequiredBox';
import { TopBar } from '@/components/TopBar';
import { useWishlistMutation } from '@/queries/useWishlistMutation';
import { useWishlistsQuery } from '@/queries/useWishlistsQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { isNearBottom } from '@/utils/scroll';

export default function FavoritesScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const {
    data: favorites = [],
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useWishlistsQuery();
  const { mutate: toggleWishlist } = useWishlistMutation();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleProductPress = (id: number) =>
    router.push({ pathname: '/product/[id]', params: { id: String(id) } });

  // 관심 버튼을 누르면 관심 상품이 해제되고, 목록을 다시 불러와 해당 상품이 빠집니다.
  const handleFavoritePress = (id: number) => toggleWishlist({ stockId: id, isWishlisted: true });

  const handleScrollWithLoadMore = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScroll(event);
    if (isNearBottom(event) && hasNextPage && !isFetchingNextPage) void fetchNextPage();
  };

  const renderBody = () => {
    if (!isLoggedIn) {
      return (
        <View className="px-6 pt-3">
          <LoginRequiredBox />
        </View>
      );
    }

    if (isPending) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      );
    }

    if (isError) {
      return (
        <Text className="pt-[104px] text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
          관심 상품을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </Text>
      );
    }

    if (favorites.length === 0) return <FavoriteEmpty />;

    return (
      <ScrollView
        onScroll={handleScrollWithLoadMore}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerClassName="px-6 pb-8 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-2.5">
          {favorites.map((product) => (
            <FavoriteProductItem
              key={product.id}
              product={product}
              onPress={() => handleProductPress(product.id)}
              onFavoritePress={() => handleFavoritePress(product.id)}
            />
          ))}
        </View>
        {isFetchingNextPage && <ActivityIndicator className="py-4" />}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="관심 상품 목록" onBack={handleBack} />

      {renderBody()}
    </SafeAreaView>
  );
}
