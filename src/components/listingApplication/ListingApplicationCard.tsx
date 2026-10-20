import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import {
  LISTING_APPLICATION_FILTERS,
  LISTING_DRAFT_STEP_LABELS,
} from '@/constants/listingApplicationsPreview';
import type {
  ListingApplicationListItem,
  ListingApplicationStatus,
} from '@/types/listingApplication';

cssInterop(Image, { className: 'style' });

const STATUS_STYLES: Record<ListingApplicationStatus, { background: string; text: string }> = {
  draft: { background: 'bg-motu-tonal', text: 'text-motu-black' },
  received: { background: 'bg-motu-grey-chip', text: 'text-motu-text-secondary' },
  reviewing: { background: 'bg-motu-grey-chip', text: 'text-motu-text-secondary' },
  supplementRequested: { background: 'bg-motu-red-light', text: 'text-motu-btn-red' },
  approved: { background: 'bg-motu-success-light', text: 'text-motu-success' },
  rejected: { background: 'bg-motu-red-light', text: 'text-motu-btn-red' },
};

type ListingApplicationCardProps = {
  application: ListingApplicationListItem;
  onContinue: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ListingApplicationCard({
  application,
  onContinue,
  onDelete,
}: ListingApplicationCardProps) {
  const statusStyle = STATUS_STYLES[application.status];
  const statusLabel = LISTING_APPLICATION_FILTERS.find(
    (filter) => filter.value === application.status,
  )?.label;
  return (
    <View className="gap-3 rounded-[14px] border border-motu-border bg-white px-[15px] py-[15px]">
      <View className="flex-row items-center gap-2.5">
        <View className="min-w-0 flex-1 gap-1">
          <Text
            numberOfLines={1}
            className="font-pretendard-bold text-[15px] leading-5 text-motu-text-primary"
          >
            {application.name}
          </Text>
          <Text
            numberOfLines={1}
            className="font-pretendard-medium text-xs leading-4 text-motu-text-tertiary"
          >
            {application.status === 'draft'
              ? `최근 저장 ${application.savedDate} · ${LISTING_DRAFT_STEP_LABELS[application.step - 1]} ${application.step}/4`
              : `신청일 ${application.submittedDate}`}
          </Text>
        </View>
        <View
          className={`h-7 items-center justify-center rounded-full px-3.5 ${application.status === 'draft' || application.status === 'supplementRequested' ? 'min-w-[76px]' : application.status === 'reviewing' ? 'min-w-[62px]' : 'min-w-[51px]'} ${statusStyle.background}`}
        >
          <Text className={`font-pretendard-medium text-xs leading-4 ${statusStyle.text}`}>
            {statusLabel}
          </Text>
        </View>
        {application.status !== 'draft' && (
          <View className="h-5 w-5 items-center justify-center">
            <Image
              source={require('../../../assets/icons/listingApplication/form/chevronRight.svg')}
              className="h-[18px] w-[18px]"
              contentFit="contain"
              accessible={false}
            />
          </View>
        )}
      </View>
      {application.status === 'draft' && (
        <View className="flex-row gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${application.name} 이어서 작성`}
            onPress={() => onContinue(application.id)}
            className="h-9 flex-1 items-center justify-center rounded-lg bg-motu-grey-lighter active:opacity-60"
          >
            <Text className="font-pretendard-medium text-xs leading-4 text-motu-black">
              이어서 작성
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${application.name} 삭제`}
            onPress={() => onDelete(application.id)}
            className="h-9 flex-1 items-center justify-center rounded-lg border border-motu-grey-lighter bg-white active:opacity-60"
          >
            <Text className="font-pretendard-medium text-xs leading-4 text-motu-black">삭제</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
