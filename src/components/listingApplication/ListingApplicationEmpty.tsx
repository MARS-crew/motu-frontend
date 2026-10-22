import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';

cssInterop(Image, { className: 'style' });

type ListingApplicationEmptyProps = {
  filterLabel?: string;
  onApplyPress?: () => void;
};

// 신청 내역이 아예 없으면 상장 신청 버튼을, 필터 결과만 없으면 상태 안내 문구를 보여 줍니다.
export function ListingApplicationEmpty({
  filterLabel,
  onApplyPress,
}: ListingApplicationEmptyProps) {
  const title = filterLabel
    ? `${filterLabel} 상태의 상장 신청이 없습니다.`
    : '아직 상장 신청 내역이 없습니다.';
  const description = filterLabel
    ? '다른 상태를 선택해 신청 내역을 확인해 보세요.'
    : '서비스 정보를 입력하고 첫 상장을 신청해 보세요.';

  return (
    <View accessibilityLiveRegion="polite" className="items-center px-6 pt-[88px]">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-motu-grey-lighter/70">
        <Image
          source={require('../../../assets/icons/listingApplication/documentEmpty.svg')}
          contentFit="contain"
          className="h-6 w-6"
        />
      </View>
      <Text className="mt-4 text-center font-pretendard-semibold text-[13.5px] leading-[20.25px] text-motu-black">
        {title}
      </Text>
      <Text className="mt-1.5 text-center font-pretendard text-xs leading-[18px] text-motu-grey">
        {description}
      </Text>
      {onApplyPress && (
        <View className="mt-6 w-40">
          <Button title="상장 신청하기" size="md" onPress={onApplyPress} />
        </View>
      )}
    </View>
  );
}
