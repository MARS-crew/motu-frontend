import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecentSearchList } from '@/components/search/RecentSearchList';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResultList } from '@/components/search/SearchResultList';
import { TopBar } from '@/components/TopBar';
import { PRODUCTS } from '@/constants/productPreview';
import { MAX_RECENT_SEARCH_COUNT, RECENT_SEARCHES } from '@/constants/searchPreview';
import { searchSchema, type SearchForm } from '@/schemas/searchSchema';

export default function SearchScreen() {
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const [products, setProducts] = useState(PRODUCTS);
  const [searchedKeyword, setSearchedKeyword] = useState<string | null>(null);
  const { control, handleSubmit, setValue } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { keyword: '' },
  });

  // 상품명 또는 카테고리에 검색어가 포함된 상품을 보여줍니다. 서버 연동 시 검색 API로 대체합니다
  const searchResults = searchedKeyword
    ? products.filter(({ name, category }) =>
        [name, category].some((text) => text.toLowerCase().includes(searchedKeyword.toLowerCase())),
      )
    : [];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSearch = handleSubmit(({ keyword }) => {
    setSearchedKeyword(keyword);
    setRecentSearches((prev) =>
      [keyword, ...prev.filter((item) => item !== keyword)].slice(0, MAX_RECENT_SEARCH_COUNT),
    );
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

  const handleRemove = (keyword: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== keyword));
  };

  const handleClearAll = () => setRecentSearches([]);

  const handleFavoritePress = (productId: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, isFavorite: !product.isFavorite } : product,
      ),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar title="검색" onBack={handleBack} />

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

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {searchedKeyword ? (
          <SearchResultList products={searchResults} onFavoritePress={handleFavoritePress} />
        ) : (
          <RecentSearchList
            keywords={recentSearches}
            onSelect={handleSelect}
            onRemove={handleRemove}
            onClearAll={handleClearAll}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
