import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecentSearchList } from '@/components/search/RecentSearchList';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResultList } from '@/components/search/SearchResultList';
import { TopBar } from '@/components/TopBar';
import {
  useDeleteAllSearchHistoriesMutation,
  useDeleteSearchHistoryMutation,
} from '@/queries/useDeleteSearchHistoryMutation';
import { useSearchHistoriesQuery } from '@/queries/useSearchHistoriesQuery';
import { useStockSearchQuery } from '@/queries/useStockSearchQuery';
import { useWishlistMutation } from '@/queries/useWishlistMutation';
import { searchSchema, type SearchForm } from '@/schemas/searchSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import type { Product } from '@/types/product';
import { isNearBottom } from '@/utils/scroll';
import { toProduct } from '@/utils/stock';

export default function SearchScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [searchedKeyword, setSearchedKeyword] = useState<string | null>(null);
  const { control, handleSubmit, setValue } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { keyword: '' },
  });

  const { data: searchHistories = [] } = useSearchHistoriesQuery();
  const searchQuery = useStockSearchQuery(searchedKeyword);
  const { mutate: deleteSearchHistory } = useDeleteSearchHistoryMutation();
  const { mutate: deleteAllSearchHistories } = useDeleteAllSearchHistoriesMutation();
  const { mutate: toggleWishlist } = useWishlistMutation();

  const searchResults = searchQuery.data?.pages.flatMap((page) => page.items.map(toProduct)) ?? [];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  // 같은 검색어를 다시 검색해도 결과와 최근 검색이 갱신되도록 다시 조회합니다.
  const handleSearch = handleSubmit(({ keyword }) => {
    if (keyword === searchedKeyword) {
      void searchQuery.refetch();
      return;
    }
    setSearchedKeyword(keyword);
  });

  // 검색어를 모두 지우면 최근 검색 목록으로 돌아갑니다.
  const handleKeywordChange = (keyword: string, onChange: (value: string) => void) => {
    onChange(keyword);
    if (!keyword.trim()) setSearchedKeyword(null);
  };

  const handleSelect = (keyword: string) => {
    setValue('keyword', keyword);
    void handleSearch();
  };

  const handleRemove = (searchHistoryId: number) => deleteSearchHistory(searchHistoryId);

  const handleClearAll = () => deleteAllSearchHistories();

  const handleProductPress = (productId: number) =>
    router.push({ pathname: '/product/[id]', params: { id: String(productId) } });

  // 관심 상품은 회원만 등록할 수 있어 비회원은 로그인 화면으로 보냅니다.
  const handleFavoritePress = (product: Product) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    toggleWishlist({ stockId: product.id, isWishlisted: product.isFavorite });
  };

  const handleScrollWithLoadMore = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScroll(event);
    if (isNearBottom(event) && searchQuery.hasNextPage && !searchQuery.isFetchingNextPage) {
      void searchQuery.fetchNextPage();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="검색" onBack={handleBack} />

      <ScrollView
        onScroll={handleScrollWithLoadMore}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerClassName="pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6">
          <Controller
            control={control}
            name="keyword"
            render={({ field: { value, onChange, onBlur } }) => (
              <SearchBar
                value={value}
                onChangeText={(keyword) => handleKeywordChange(keyword, onChange)}
                onBlur={onBlur}
                onSubmit={handleSearch}
              />
            )}
          />
        </View>

        {searchedKeyword ? (
          <SearchResultList
            products={searchResults}
            isLoading={searchQuery.isPending}
            isError={searchQuery.isError}
            isFetchingNextPage={searchQuery.isFetchingNextPage}
            onProductPress={handleProductPress}
            onFavoritePress={handleFavoritePress}
          />
        ) : (
          // 비회원은 검색어가 저장되지 않아 최근 검색이 비어 있습니다.
          <RecentSearchList
            histories={searchHistories}
            onSelect={handleSelect}
            onRemove={handleRemove}
            onClearAll={handleClearAll}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
