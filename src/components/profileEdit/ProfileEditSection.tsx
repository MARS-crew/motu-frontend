import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

type ProfileEditSectionProps = {
  title: string;
  children: ReactNode;
};

// '계정 정보', '개인 정보'처럼 제목이 있는 흰색 카드입니다.
// Figma 기준 좌우는 테두리 포함 21px, 위아래는 테두리 바깥으로 21px이라 px/py를 나눠 씁니다.
export function ProfileEditSection({ title, children }: ProfileEditSectionProps) {
  return (
    <View className="gap-[16px] rounded-[16px] border border-motu-grey-lighter bg-white px-[20px] py-[21px]">
      <Text
        accessibilityRole="header"
        className="font-pretendard-bold text-[13px] leading-[19.5px] text-motu-black"
      >
        {title}
      </Text>
      {children}
    </View>
  );
}
