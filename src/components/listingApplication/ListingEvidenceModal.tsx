import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import type { EvidenceItem } from '@/schemas/listingEvidenceSchema';
import { formatEvidenceSize } from '@/utils/listingEvidence';

type ListingEvidenceModalProps = {
  isHelpVisible: boolean;
  isDeleteVisible: boolean;
  item: EvidenceItem | null;
  onClose: () => void;
  onDelete: () => void;
};

export function ListingEvidenceModal({
  isHelpVisible,
  isDeleteVisible,
  item,
  onClose,
  onDelete,
}: ListingEvidenceModalProps) {
  const isFile = item?.kind === 'file';
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isHelpVisible || isDeleteVisible}
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
            accessibilityLabel="증빙 자료 창 닫기"
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
              {item ? (isFile ? '증빙 파일 삭제' : '증빙 링크 삭제') : '첨부 가능한 자료'}
            </Text>
            {item ? (
              <>
                <View className="flex-row items-center gap-2.5 rounded-[10px] bg-motu-bg-secondary px-[14px] py-3">
                  <Text
                    numberOfLines={1}
                    className="min-w-0 flex-1 font-pretendard-medium text-[13px] leading-[18px] text-motu-text-primary"
                  >
                    {item.kind === 'file' ? item.name : item.url}
                  </Text>
                  <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-text-tertiary">
                    {item.kind === 'file' ? formatEvidenceSize(item.size) : '외부 링크'}
                  </Text>
                </View>
                <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
                  선택한 증빙 {isFile ? '파일을' : '링크를'} 삭제하시겠습니까?
                </Text>
                <View className="flex-row gap-2.5">
                  <View className="flex-1">
                    <Button title="취소" size="md" variant="secondary" onPress={onClose} />
                  </View>
                  <View className="flex-1">
                    <Button title="삭제" size="md" color="danger" onPress={onDelete} />
                  </View>
                </View>
              </>
            ) : (
              <>
                {[
                  '• 이미지: JPG, JPEG, PNG / 파일당 10MB 이하',
                  '• 문서: PDF / 파일당 20MB 이하',
                  '• 최대 10개 파일, 외부 링크 URL 등록 가능',
                ].map((line) => (
                  <Text
                    key={line}
                    className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary"
                  >
                    {line}
                  </Text>
                ))}
                <Button title="확인" size="md" onPress={onClose} />
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
