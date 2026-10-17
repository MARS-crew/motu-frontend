import { Text, View } from 'react-native';

type HomeEmptyBoxProps = {
  message: string;
};

// 홈 섹션 카드 안의 빈 상태 안내입니다. 로그인 안내 박스와 같은 모양을 사용합니다.
export function HomeEmptyBox({ message }: HomeEmptyBoxProps) {
  return (
    <View className="items-center justify-center rounded-xl bg-motu-grey-lighter/60 px-4 py-6">
      <Text className="text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
        {message}
      </Text>
    </View>
  );
}
