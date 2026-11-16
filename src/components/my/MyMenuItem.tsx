import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type MyMenuItemProps = {
  icon: number;
  title: string;
  description?: string;
  tone?: 'default' | 'danger';
  hasChevron?: boolean;
  hasDivider?: boolean;
  onPress?: () => void;
};

// 마이페이지 메뉴 한 줄: [아이콘] 제목(+설명) [>]
// 설명이 있는 줄은 디자인대로 높이 66px, 간격 6px로 설명이 한 줄에 들어가게 합니다.
// 구분선(테두리 1px)이 있는 줄은 위 여백을 1px 줄여 줄 높이를 60px로 맞춥니다.
export function MyMenuItem({
  icon,
  title,
  description,
  tone = 'default',
  hasChevron = true,
  hasDivider = false,
  onPress,
}: MyMenuItemProps) {
  const isDanger = tone === 'danger';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`flex-row items-center px-[16px] active:bg-motu-grey-lighter/40 ${description ? 'min-h-[66px] gap-[6px]' : 'min-h-[60px] gap-[12px]'} ${hasDivider ? 'border-t border-motu-grey-lighter pb-[12px] pt-[11px]' : 'py-[12px]'}`}
    >
      <View
        className={`h-[36px] w-[36px] items-center justify-center rounded-[8px] ${isDanger ? 'bg-motu-red/10' : 'bg-motu-grey-lighter/50'}`}
      >
        <Image
          source={icon}
          contentFit="contain"
          className="h-[17px] w-[17px]"
          accessible={false}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`font-pretendard-semibold text-[13.5px] leading-[20.25px] ${isDanger ? 'text-motu-red' : 'text-motu-black'}`}
        >
          {title}
        </Text>
        {description && (
          <Text className="mt-[4px] font-pretendard text-[11.5px] leading-[16px] text-motu-grey">
            {description}
          </Text>
        )}
      </View>
      {hasChevron && (
        <Image
          source={require('../../../assets/icons/my/chevronRight.svg')}
          contentFit="contain"
          className="h-[18px] w-[18px]"
          accessible={false}
        />
      )}
    </Pressable>
  );
}
