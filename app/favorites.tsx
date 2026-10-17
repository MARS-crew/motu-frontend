import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FavoriteEmpty } from '@/components/favorite/FavoriteEmpty';
import { FavoriteProductItem } from '@/components/favorite/FavoriteProductItem';
import { TopBar } from '@/components/TopBar';
import { FAVORITE_PRODUCTS } from '@/constants/favoritePreview';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState(FAVORITE_PRODUCTS);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  // 관심 버튼을 누르면 관심 상품이 해제되면서 목록에서 바로 빠집니다.
  const handleFavoritePress = (id: number) => {
    setFavorites((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar title="관심 상품 목록" onBack={handleBack} />

      {favorites.length > 0 ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-8 pt-2"
          showsVerticalScrollIndicator={false}
        >
          {/* 상품 상세 화면이 추가되면 onPress로 이동을 연결합니다. */}
          <View className="gap-2.5">
            {favorites.map((product) => (
              <FavoriteProductItem
                key={product.id}
                product={product}
                onFavoritePress={() => handleFavoritePress(product.id)}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <FavoriteEmpty />
      )}
    </SafeAreaView>
  );
}
