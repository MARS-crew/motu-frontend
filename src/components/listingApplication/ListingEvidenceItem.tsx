import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import type { EvidenceItem } from '@/schemas/listingEvidenceSchema';
import { formatEvidenceSize } from '@/utils/listingEvidence';

cssInterop(Image, { className: 'style' });

type ListingEvidenceItemProps = { item: EvidenceItem; disabled?: boolean; onDelete: () => void };

export function ListingEvidenceItem({
  item,
  onDelete,
  disabled = false,
}: ListingEvidenceItemProps) {
  const name = item.kind === 'file' ? item.name : item.url;
  return (
    <View className="flex-row items-center gap-2.5 rounded-[10px] bg-motu-bg-secondary px-[14px] py-3">
      <View className="min-w-0 flex-1 gap-0.5">
        <Text
          numberOfLines={1}
          className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-primary"
        >
          {name}
        </Text>
        <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-text-tertiary">
          {item.kind === 'file' ? formatEvidenceSize(item.size) : '외부 링크'}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${name} 삭제`}
        onPress={onDelete}
        disabled={disabled}
        hitSlop={10}
      >
        <Image
          source={require('../../../assets/icons/listingApplication/evidence/trash.svg')}
          className="h-[18px] w-[18px]"
          contentFit="contain"
        />
      </Pressable>
    </View>
  );
}
