import { View } from 'react-native';

import { Button } from '@/components/Button';

type ProfileEditFooterProps = {
  disabled?: boolean;
  onPress?: () => void;
};

// 화면 하단에 고정되는 '회원정보 수정하기' 버튼 영역입니다.
export function ProfileEditFooter({ disabled = false, onPress }: ProfileEditFooterProps) {
  return (
    <View className="border-t border-motu-grey-lighter bg-motu-bg px-[24px] pb-[20px] pt-[17px]">
      <Button title="회원정보 수정하기" disabled={disabled} onPress={onPress} />
    </View>
  );
}
