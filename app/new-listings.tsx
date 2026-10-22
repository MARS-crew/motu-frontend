import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NewListingEmpty } from '@/components/newListing/NewListingEmpty';
import { NewListingItem } from '@/components/newListing/NewListingItem';
import { TopBar } from '@/components/TopBar';
import { NEW_LISTING_LIST } from '@/constants/newListingPreview';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function NewListingsScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const [listings, setListings] = useState(NEW_LISTING_LIST);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleFavoritePress = (id: number) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id ? { ...listing, isFavorite: !listing.isFavorite } : listing,
      ),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="신규 상장 목록" onBack={handleBack} />

      {listings.length > 0 ? (
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          className="flex-1"
          contentContainerClassName="px-6 pb-8 pt-3"
          showsVerticalScrollIndicator={false}
        >
          {/* 상품 상세 화면이 추가되면 onPress로 이동을 연결합니다. */}
          <View className="gap-2">
            {listings.map((listing) => (
              <NewListingItem
                key={listing.id}
                listing={listing}
                onFavoritePress={() => handleFavoritePress(listing.id)}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <NewListingEmpty />
      )}
    </SafeAreaView>
  );
}
