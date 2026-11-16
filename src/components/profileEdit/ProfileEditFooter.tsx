import { View } from 'react-native';

import { Button } from '@/components/Button';

type ProfileEditFooterProps = {
  title: string;
  disabled?: boolean;
  onPress?: () => void;
};

// 회원정보 수정 흐름에서 화면 하단에 고정되는 버튼 영역입니다.
export function ProfileEditFooter({ title, disabled = false, onPress }: ProfileEditFooterProps) {
  return (
    <View className="border-t border-motu-grey-lighter bg-motu-bg px-[24px] pb-[20px] pt-[17px]">
      <Button title={title} disabled={disabled} onPress={onPress} />
    </View>
  );
}
