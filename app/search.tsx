import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecentSearchList } from '@/components/search/RecentSearchList';
import { SearchBar } from '@/components/search/SearchBar';
import { TopBar } from '@/components/TopBar';
import { MAX_RECENT_SEARCH_COUNT, RECENT_SEARCHES } from '@/constants/searchPreview';
import { searchSchema, type SearchForm } from '@/schemas/searchSchema';

export default function SearchScreen() {
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const { control, handleSubmit, setValue } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { keyword: '' },
  });

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  // 검색 결과 화면이 추가되면 결과 화면으로 이동합니다.
  const handleSearch = handleSubmit(({ keyword }) => {
    setRecentSearches((prev) =>
      [keyword, ...prev.filter((item) => item !== keyword)].slice(0, MAX_RECENT_SEARCH_COUNT),
    );
  });

  const handleSelect = (keyword: string) => {
    setValue('keyword', keyword);
    void handleSearch();
  };

  const handleRemove = (keyword: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== keyword));
  };

  const handleClearAll = () => setRecentSearches([]);

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
              onChangeText={onChange}
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
        <RecentSearchList
          keywords={recentSearches}
          onSelect={handleSelect}
          onRemove={handleRemove}
          onClearAll={handleClearAll}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
