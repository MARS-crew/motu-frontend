import { useState } from 'react';
import { Text, View } from 'react-native';

import { FaqFilterChips } from '@/components/faq/FaqFilterChips';
import { FaqItem } from '@/components/faq/FaqItem';
import { FAQ_FILTERS, FAQS } from '@/constants/faqPreview';
import type { FaqFilter } from '@/types/faq';

export function FaqSection() {
  const [selectedFilter, setSelectedFilter] = useState<FaqFilter>('전체');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqs =
    selectedFilter === '전체' ? FAQS : FAQS.filter((faq) => faq.category === selectedFilter);

  const handleFilterChange = (filter: FaqFilter) => {
    setSelectedFilter(filter);
    setExpandedId(null);
  };

  // 열린 질문을 다시 누르면 접고, 다른 질문을 누르면 그 질문만 펼칩니다.
  const handleFaqPress = (id: number) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <View className="mt-5">
      <FaqFilterChips
        filters={FAQ_FILTERS}
        value={selectedFilter}
        onValueChange={handleFilterChange}
      />

      {faqs.length > 0 ? (
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
      ) : (
        <Text className="pt-20 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
          등록된 질문이 없어요.
        </Text>
      )}
    </View>
  );
}
