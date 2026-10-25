import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import type { SearchHistory } from '@/types/search';

cssInterop(Image, { className: 'style' });

type RecentSearchListProps = {
  histories: SearchHistory[];
  onSelect: (keyword: string) => void;
  onRemove: (searchHistoryId: number) => void;
  onClearAll: () => void;
};

export function RecentSearchList({
  histories,
  onSelect,
  onRemove,
  onClearAll,
}: RecentSearchListProps) {
  const hasKeywords = histories.length > 0;

  return (
    <View className="px-6 pt-6">
      <View className="flex-row items-center justify-between">
        <Text
          accessibilityRole="header"
          className="font-pretendard-bold text-[13px] leading-[18px] text-motu-black"
        >
          최근 검색
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onClearAll}
          disabled={!hasKeywords}
          hitSlop={8}
          className="active:opacity-60"
        >
          <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
            전체 삭제
          </Text>
        </Pressable>
      </View>

      {hasKeywords ? (
        <View className="mt-3 gap-2">
          {histories.map(({ searchHistoryId, keyword }) => (
            <View
              key={searchHistoryId}
              className="flex-row items-center rounded-xl border border-motu-grey-lighter bg-white"
            >
              <Pressable
                accessibilityRole="button"
                onPress={() => onSelect(keyword)}
                className="flex-1 py-3 pl-4 pr-2 active:opacity-60"
              >
                <Text
                  numberOfLines={1}
                  className="font-pretendard-medium text-[13px] leading-[18px] text-motu-black"
                >
                  {keyword}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${keyword} 삭제`}
                onPress={() => onRemove(searchHistoryId)}
                className="h-full w-10 items-center justify-center active:opacity-60"
              >
                <Image
                  source={require('../../../assets/icons/search/close.svg')}
                  contentFit="contain"
                  className="h-4 w-4"
                />
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text className="pt-20 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
          최근 검색 내역이 없습니다.
        </Text>
      )}
    </View>
  );
}
