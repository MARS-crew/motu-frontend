import { Text } from 'react-native';

import {
  ProductDetailDialog,
  ProductDetailDialogButtons,
} from '@/components/productDetail/ProductDetailDialog';

type LoginRequiredModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onLoginPress: () => void;
};

// 비로그인 상태에서 주문하면 표시합니다. (화면설계서 USR-MARKET-02-M02)
export function LoginRequiredModal({ isVisible, onClose, onLoginPress }: LoginRequiredModalProps) {
  return (
    <ProductDetailDialog isVisible={isVisible} title="로그인 안내" onClose={onClose}>
      <Text className="mt-7 text-center font-pretendard-medium text-[13px] leading-[18px] text-motu-black">
        로그인이 필요한 서비스입니다.
      </Text>
      <ProductDetailDialogButtons
        secondaryTitle="취소"
        primaryTitle="로그인"
        onSecondaryPress={onClose}
        onPrimaryPress={onLoginPress}
      />
    </ProductDetailDialog>
  );
}
