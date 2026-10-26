import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { TopBar } from '@/components/TopBar';
import { ListingEvidenceFields } from '@/components/listingApplication/ListingEvidenceFields';
import { ListingEvidenceModal } from '@/components/listingApplication/ListingEvidenceModal';
import { useListingEvidencePicker } from '@/hooks/useListingEvidencePicker';
import {
  EVIDENCE_COUNT_ERROR,
  MAX_EVIDENCE_ITEMS,
  evidenceLinkSchema,
  listingEvidenceSchema,
  type EvidenceItem,
  type ListingEvidenceForm,
} from '@/schemas/listingEvidenceSchema';
import { useListingDraftStore } from '@/stores/useListingDraftStore';
import { createEvidenceId } from '@/utils/listingEvidence';
import { getListingRevisionError } from '@/utils/listingRevision';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

type ListingSupplementEditorProps = {
  applicationId: string;
  initialValues: ListingEvidenceForm;
  onSave?: (values: ListingEvidenceForm) => Promise<void>;
  onBack?: () => void;
  canSubmit?: boolean;
};

export function ListingSupplementEditor({
  applicationId,
  initialValues,
  onSave,
  onBack,
  canSubmit = true,
}: ListingSupplementEditorProps) {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const saveSupplementDraft = useListingDraftStore((state) => state.saveSupplementDraft);
  const [isSaving, setIsSaving] = useState(false);
  const requestLock = useRef(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const formOffset = useRef(0);
  const descriptionOffset = useRef(0);
  const {
    control,
    getValues,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingEvidenceForm>({
    resolver: zodResolver(listingEvidenceSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });
  const values = useWatch({ control });
  const canSave = listingEvidenceSchema.safeParse(values).success;
  const handleItemsChange = (items: EvidenceItem[]) => {
    setValue('items', items, { shouldDirty: true, shouldValidate: true });
    setAttachmentError(null);
  };
  const picker = useListingEvidencePicker({
    onSelect: (files) => {
      const items = getValues('items');
      if (items.length + files.length > MAX_EVIDENCE_ITEMS) {
        setAttachmentError(EVIDENCE_COUNT_ERROR);
        return;
      }
      handleItemsChange([...items, ...files]);
    },
    onError: setAttachmentError,
  });
  const handlePick = () => {
    setAttachmentError(null);
    void picker.handlePick();
  };
  const handleAddLink = () => {
    const items = getValues('items');
    if (items.length >= MAX_EVIDENCE_ITEMS) {
      setAttachmentError(EVIDENCE_COUNT_ERROR);
      return;
    }
    const parsed = evidenceLinkSchema.safeParse(getValues('linkUrl'));
    if (!parsed.success) {
      setError('linkUrl', { type: 'validate', message: parsed.error.issues[0].message });
      return;
    }
    handleItemsChange([...items, { id: createEvidenceId(), kind: 'link', url: parsed.data }]);
    setValue('linkUrl', '', { shouldDirty: true });
    clearErrors('linkUrl');
  };
  const handleCloseModal = () => {
    setIsHelpVisible(false);
    setIsDeleteVisible(false);
  };
  const handleConfirmDelete = () => {
    if (requestLock.current) return;
    if (selectedItem)
      handleItemsChange(getValues('items').filter((item) => item.id !== selectedItem.id));
    handleCloseModal();
  };
  const handleBack = () => {
    if (picker.isPicking || requestLock.current) return;
    // 수정 완료 전에는 기존 자료를 변경하지 않습니다.
    if (onBack) {
      onBack();
      return;
    }
    router.dismissTo({ pathname: '/listing-application/supplement', params: { applicationId } });
  };
  const handleSave = () => {
    if (!canSubmit || picker.isPicking || requestLock.current) return;
    void handleSubmit(
      async (currentValues) => {
        if (requestLock.current) return;
        requestLock.current = true;
        setIsSaving(true);
        setAttachmentError(null);
        try {
          if (onSave) await onSave(currentValues);
          else if (saveSupplementDraft(applicationId, currentValues)) {
            router.dismissTo({
              pathname: '/listing-application/supplement',
              params: { applicationId },
            });
          }
        } catch (error: unknown) {
          setAttachmentError(getListingRevisionError(error));
        } finally {
          requestLock.current = false;
          setIsSaving(false);
        }
      },
      () =>
        scrollRef.current?.scrollTo({
          y: Math.max(0, formOffset.current + descriptionOffset.current - 12),
          animated: true,
        }),
    )();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TopBar
        isScrolled={isScrolled}
        title="보완 자료 수정"
        variant="listing-detail"
        onBack={handleBack}
      />
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="flex-grow gap-6 px-6 pb-7 pt-3"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1.5">
          <Text
            accessibilityRole="header"
            className="font-pretendard-bold text-2xl leading-8 text-motu-text-primary"
          >
            보완 증빙 자료 수정
          </Text>
          <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
            기존 자료를 유지하거나 새 자료를 추가할 수 있습니다.
          </Text>
        </View>
        <View
          className="gap-4"
          onLayout={(event) => {
            formOffset.current = event.nativeEvent.layout.y;
          }}
        >
          <ListingEvidenceFields
            control={control}
            errors={errors}
            attachmentError={
              attachmentError ??
              (!canSubmit ? '보완 기한이 지났거나 현재 수정 자료를 저장할 수 없습니다.' : null)
            }
            isPicking={picker.isPicking}
            isSaving={isSaving}
            onPick={handlePick}
            onHelp={() => {
              setSelectedItem(null);
              setIsHelpVisible(true);
            }}
            onDelete={(item) => {
              setSelectedItem(item);
              setIsDeleteVisible(true);
            }}
            onAddLink={handleAddLink}
            onDescriptionLayout={(offset) => {
              descriptionOffset.current = offset;
            }}
          />
        </View>
        <View className="min-h-px flex-1" />
        <View className="flex-row gap-2.5">
          <View className="flex-1">
            <Button
              title="이전"
              variant="secondary"
              onPress={handleBack}
              disabled={picker.isPicking || isSaving}
            />
          </View>
          <View className="flex-1">
            <Button
              title="수정 완료"
              onPress={handleSave}
              disabled={!canSubmit || !canSave || picker.isPicking || isSaving}
            />
          </View>
        </View>
      </ScrollView>
      <ListingEvidenceModal
        isHelpVisible={isHelpVisible}
        isDeleteVisible={isDeleteVisible}
        item={selectedItem}
        onClose={handleCloseModal}
        onDelete={handleConfirmDelete}
      />
    </KeyboardAvoidingView>
  );
}
