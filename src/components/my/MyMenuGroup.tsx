import type { ReactNode } from 'react';
import { View } from 'react-native';

type MyMenuGroupProps = {
  children: ReactNode;
};

// 메뉴 여러 줄을 하나의 카드로 묶습니다.
export function MyMenuGroup({ children }: MyMenuGroupProps) {
  return (
    <View className="overflow-hidden rounded-[16px] border border-motu-grey-lighter bg-white">
      {children}
    </View>
  );
}
