import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';

type ListingMetricsHelpModalProps = {
  type: 'terms' | 'criteria' | null;
  onClose: () => void;
};

export function ListingMetricsHelpModal({ type, onClose }: ListingMetricsHelpModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={type !== null}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 bg-motu-text-primary/55">
        <ScrollView
          className="flex-1"
          contentContainerClassName="relative flex-grow items-center justify-center px-6 py-10"
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="지표 안내 창 닫기"
            onPress={onClose}
            className="absolute inset-0"
          />
          <View
            accessibilityViewIsModal
            className="w-full max-w-md gap-3 rounded-[20px] bg-white px-6 pb-[22px] pt-[26px]"
          >
            <Text
              accessibilityRole="header"
              className="font-pretendard-bold text-base leading-[22px] text-motu-text-primary"
            >
              {type === 'terms' ? '지표 용어 안내' : '입력 기준 안내'}
            </Text>
            {type === 'terms' ? (
              <>
                <View className="gap-0.5">
                  <Text className="font-pretendard-medium text-xs leading-4 text-motu-black">
                    MAU
                  </Text>
                  <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
                    기준월 동안 한 번 이상 이용한 고유 사용자 수
                  </Text>
                </View>
                <View className="gap-0.5">
                  <Text className="font-pretendard-medium text-xs leading-4 text-motu-black">
                    DAU
                  </Text>
                  <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
                    기준일 하루 동안 한 번 이상 이용한 고유 사용자 수
                  </Text>
                </View>
                <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
                  중복 사용자는 각 집계 기간에 한 명으로 계산합니다.
                </Text>
              </>
            ) : (
              <>
                {[
                  '매출: 최근 완료 회계연도의 연간 매출',
                  '거래액: 최근 완료 12개월 결제 완료액',
                  '운영 12개월 미만: 출시일~자료 기준일 누적값',
                  '12개월 초과 기간은 선택할 수 없습니다.',
                ].map((line) => (
                  <Text
                    key={line}
                    className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary"
                  >
                    {line}
                  </Text>
                ))}
              </>
            )}
            <Button title="확인" size="md" onPress={onClose} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
