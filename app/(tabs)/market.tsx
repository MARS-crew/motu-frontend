import { CategoryChip } from '@/components/CategoryChip';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = [
  '전체',
  'SaaS / 소프트웨어',
  'AI / 데이터',
  '핀테크',
  '커머스 / 유통',
  '콘텐츠 / 미디어',
  '헬스케어',
  '교육',
  '모빌리티',
  '기타',
];

export default function MarketScreen() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <View className="px-6 pb-4 pt-8">
        <Text className="font-inter-bold text-lg leading-6 text-motu-black">상품 목록</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="h-11">
        <View className="h-11 flex-row items-center gap-2 px-6">
          {CATEGORIES.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              isSelected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </View>
      </ScrollView>
      <View className="flex-1 items-center justify-center">
        <Text className="font-inter-bold text-xl text-motu-black">{selectedCategory}</Text>
      </View>
    </SafeAreaView>
  );
}
