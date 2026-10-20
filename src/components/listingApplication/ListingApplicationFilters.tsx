import { View } from 'react-native';

import { CategoryChip } from '@/components/CategoryChip';
import { LISTING_APPLICATION_FILTERS } from '@/constants/listingApplicationsPreview';
import type { ListingApplicationFilter } from '@/types/listingApplication';

type ListingApplicationFiltersProps = {
  value: ListingApplicationFilter;
  onChange: (value: ListingApplicationFilter) => void;
};

export function ListingApplicationFilters({ value, onChange }: ListingApplicationFiltersProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {LISTING_APPLICATION_FILTERS.map((filter) => (
        <CategoryChip
          key={filter.value}
          label={filter.label}
          isSelected={value === filter.value}
          onPress={() => onChange(filter.value)}
        />
      ))}
    </View>
  );
}
