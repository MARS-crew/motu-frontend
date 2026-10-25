import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { FaqFilterChips } from '@/components/faq/FaqFilterChips';
import { FaqItem } from '@/components/faq/FaqItem';
import { FAQ_FILTERS } from '@/constants/faq';
import { useFaqsQuery } from '@/queries/useFaqsQuery';
import type { FaqFilter } from '@/types/faq';

const FAQ_FILTER_LABELS = FAQ_FILTERS.map(({ label }) => label);

export function FaqSection() {
  const [selectedFilter, setSelectedFilter] = useState<FaqFilter>('전체');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const selectedCode = FAQ_FILTERS.find(({ label }) => label === selectedFilter)?.code ?? 'ALL';
  const { data: faqs = [], isPending, isError } = useFaqsQuery(selectedCode);

  const handleFilterChange = (filter: FaqFilter) => {
    setSelectedFilter(filter);
    setExpandedId(null);
  };

  // 열린 질문을 다시 누르면 접고, 다른 질문을 누르면 그 질문만 펼칩니다.
  const handleFaqPress = (id: number) => setExpandedId((prev) => (prev === id ? null : id));

  const renderBody = () => {
    if (isPending) {
      return (
        <View className="items-center pt-20">
          <ActivityIndicator />
        </View>
      );
    }

    if (isError || faqs.length === 0) {
      return (
        <Text className="pt-20 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
          {isError
            ? 'FAQ를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
            : '등록된 질문이 없어요.'}
        </Text>
      );
    }

    return (
      <View className="mt-4 gap-2.5">
        {faqs.map((faq) => (
          <FaqItem
            key={faq.id}
            faq={faq}
            isExpanded={expandedId === faq.id}
            onPress={() => handleFaqPress(faq.id)}
          />
        ))}
      </View>
    );
  };

  return (
    <View className="mt-5">
      <FaqFilterChips
        filters={FAQ_FILTER_LABELS}
        value={selectedFilter}
        onValueChange={handleFilterChange}
      />

      {renderBody()}
    </View>
  );
}
