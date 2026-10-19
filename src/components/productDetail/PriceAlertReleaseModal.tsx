import { Text } from 'react-native';

import {
  ProductDetailDialogButtons,
  ProductDetailDialog,
} from '@/components/productDetail/ProductDetailDialog';

type PriceAlertReleaseModalProps = {
  isVisible: boolean;
  productName: string;
  alertPrice: number;
  onClose: () => void;
  onCancel: () => void;
  onRelease: () => void;
};

export function PriceAlertReleaseModal({
  isVisible,
  productName,
  alertPrice,
  onClose,
  onCancel,
  onRelease,
}: PriceAlertReleaseModalProps) {
  return (
    <ProductDetailDialog isVisible={isVisible} title="지정가 알림 해제" onClose={onClose}>
      <Text className="mt-7 text-center font-pretendard-medium text-[13px] leading-[18px] text-motu-black">
        {`${productName}의 ${alertPrice.toLocaleString('ko-KR')}P 가격 알림을 해제하시겠습니까? 해제 후 해당 가격에 도달해도 알림이 발송되지 않습니다.`}
      </Text>
      <ProductDetailDialogButtons
        secondaryTitle="취소"
        primaryTitle="알림 해제"
        onSecondaryPress={onCancel}
        onPrimaryPress={onRelease}
      />
    </ProductDetailDialog>
  );
}
