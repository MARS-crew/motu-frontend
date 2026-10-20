import { Text, View } from 'react-native';

import { LISTING_APPLICATION_FILTERS } from '@/constants/listingApplicationsPreview';
import type { ListingApplicationStatus } from '@/types/listingApplication';

const STATUS_STYLES: Record<ListingApplicationStatus, { background: string; text: string }> = {
  draft: { background: 'bg-motu-tonal', text: 'text-motu-black' },
  received: { background: 'bg-motu-bg-secondary', text: 'text-motu-text-secondary' },
  reviewing: { background: 'bg-motu-grey-chip', text: 'text-motu-text-secondary' },
  supplementRequested: { background: 'bg-motu-red-light', text: 'text-motu-btn-red' },
  approved: { background: 'bg-motu-success-light', text: 'text-motu-success' },
  rejected: { background: 'bg-motu-red-light', text: 'text-motu-btn-red' },
};

type ListingApplicationStatusBadgeProps = {
  status: ListingApplicationStatus;
};

export function ListingApplicationStatusBadge({ status }: ListingApplicationStatusBadgeProps) {
  const statusStyle = STATUS_STYLES[status];
  const label = LISTING_APPLICATION_FILTERS.find((filter) => filter.value === status)?.label;
  return (
    <View
      className={`h-7 items-center justify-center rounded-full px-3.5 ${status === 'draft' || status === 'supplementRequested' ? 'min-w-[76px]' : status === 'reviewing' ? 'min-w-[62px]' : 'min-w-[51px]'} ${statusStyle.background}`}
    >
      <Text className={`font-pretendard-medium text-xs leading-4 ${statusStyle.text}`}>
        {label}
      </Text>
    </View>
  );
}
