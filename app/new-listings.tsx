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

import { NewListingEmpty } from '@/components/newListing/NewListingEmpty';
import { NewListingItem } from '@/components/newListing/NewListingItem';
import { TopBar } from '@/components/TopBar';
import { useNewListingsQuery } from '@/queries/useNewListingsQuery';
import { useWishlistMutation } from '@/queries/useWishlistMutation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import type { NewListing } from '@/types/newListing';
import { isNearBottom } from '@/utils/scroll';

export default function NewListingsScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  // 서버가 최근 상장순으로 내려줘서 신규 상품이 목록 위에 옵니다.
  const {
    data: listings = [],
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNewListingsQuery();
  const { mutate: toggleWishlist } = useWishlistMutation();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleListingPress = (id: number) =>
    router.push({ pathname: '/product/[id]', params: { id: String(id) } });

  // 관심 상품은 회원만 등록할 수 있어 비회원은 로그인 화면으로 보냅니다.
  const handleFavoritePress = (listing: NewListing) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    toggleWishlist({ stockId: listing.id, isWishlisted: listing.isFavorite });
  };

  const handleScrollWithLoadMore = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScroll(event);
    if (isNearBottom(event) && hasNextPage && !isFetchingNextPage) void fetchNextPage();
  };

  const renderBody = () => {
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
          신규 상장 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </Text>
      );
    }

    if (listings.length === 0) return <NewListingEmpty />;

    return (
      <ScrollView
        onScroll={handleScrollWithLoadMore}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerClassName="px-6 pb-8 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-2">
          {listings.map((listing) => (
            <NewListingItem
              key={listing.id}
              listing={listing}
              onPress={() => handleListingPress(listing.id)}
              onFavoritePress={() => handleFavoritePress(listing)}
            />
          ))}
        </View>
        {isFetchingNextPage && <ActivityIndicator className="py-4" />}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="신규 상장 목록" onBack={handleBack} />

      {renderBody()}
    </SafeAreaView>
  );
}
