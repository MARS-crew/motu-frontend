import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type ListingFormHeaderProps = {
  savedAt: string | null;
  isDirty: boolean;
  onBack: () => void;
};

export function ListingFormHeader({ savedAt, isDirty, onBack }: ListingFormHeaderProps) {
  return (
    <View className="flex-row items-center gap-[14px] px-5 pb-5 pt-8">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="뒤로가기"
        onPress={onBack}
        hitSlop={10}
      >
        <Image
          source={require('../../../assets/icons/listingApplication/form/backArrow.svg')}
          className="h-6 w-6"
          contentFit="contain"
        />
      </Pressable>
      <Text
        accessibilityRole="header"
        className="flex-1 font-pretendard-bold text-lg leading-6 text-motu-text-primary"
      >
        상장 신청
      </Text>
      <View accessibilityLiveRegion="polite" className="flex-row items-center gap-1">
        {savedAt && !isDirty && (
          <Image
            source={require('../../../assets/icons/listingApplication/form/savedCheck.svg')}
            className="h-[14px] w-[14px]"
            contentFit="contain"
          />
        )}
        <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
          {savedAt && !isDirty ? `임시 저장됨 ${savedAt}` : '작성 중'}
        </Text>
      </View>
    </View>
  );
}
