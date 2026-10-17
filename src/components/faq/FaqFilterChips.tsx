import { Pressable, ScrollView, Text } from 'react-native';

import type { FaqFilter } from '@/types/faq';

type FaqFilterChipsProps = {
  filters: FaqFilter[];
  value: FaqFilter;
  onValueChange: (value: FaqFilter) => void;
};

// 칩 목록은 화면 좌우 끝까지 스크롤되도록 부모의 px-6 여백만큼 바깥으로 넓힙니다.
export function FaqFilterChips({ filters, value, onValueChange }: FaqFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-6"
      contentContainerClassName="gap-2 px-6"
    >
      {filters.map((filter) => {
        const isSelected = filter === value;

        return (
          <Pressable
            key={filter}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onValueChange(filter)}
            className={`h-[30px] items-center justify-center rounded-full px-3.5 ${
              isSelected ? 'bg-motu-black' : 'bg-motu-grey-chip'
            }`}
          >
            <Text
              className={`font-pretendard-medium text-xs leading-4 ${
                isSelected ? 'text-white' : 'text-motu-grey'
              }`}
            >
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
