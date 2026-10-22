import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ListingEvidenceFields } from '@/components/listingApplication/ListingEvidenceFields';
import { ListingEvidenceModal } from '@/components/listingApplication/ListingEvidenceModal';
import { ListingFormHeader } from '@/components/listingApplication/ListingFormHeader';
import { ListingFormStepper } from '@/components/listingApplication/ListingFormStepper';
import { EMPTY_LISTING_EVIDENCE } from '@/constants/listingEvidencePreview';
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
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function ListingEvidenceScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { draftId } = useLocalSearchParams<{ draftId?: string }>();
  const [currentDraftId] = useState(() => draftId || `draft-${Date.now()}`);
  const [initialDraft] = useState(() => useListingDraftStore.getState().drafts[currentDraftId]);
  const [savedAt, setSavedAt] = useState<string | null>(
    initialDraft?.evidenceValues ? initialDraft.savedAt : null,
  );
  const saveEvidenceDraft = useListingDraftStore((state) => state.saveEvidenceDraft);
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
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ListingEvidenceForm>({
    resolver: zodResolver(listingEvidenceSchema),
    defaultValues: initialDraft?.evidenceValues ?? EMPTY_LISTING_EVIDENCE,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });
  const values = useWatch({ control });
  const canProceed = listingEvidenceSchema.safeParse(values).success;
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
    if (selectedItem)
      handleItemsChange(getValues('items').filter((item) => item.id !== selectedItem.id));
    handleCloseModal();
  };
  const handleSave = () => {
    const currentValues = getValues();
    setSavedAt(saveEvidenceDraft(currentDraftId, currentValues));
    reset(currentValues);
  };
  const handlePrevious = () => {
    if (picker.isPicking) return;
    handleSave();
    router.dismissTo({
      pathname: '/listing-application/service-metrics',
      params: { draftId: currentDraftId },
    });
  };
  const handleNext = () =>
    void handleSubmit(
      () => {
        handleSave();
        router.push({
          pathname: '/listing-application/review',
          params: { draftId: currentDraftId },
        });
      },
      () =>
        scrollRef.current?.scrollTo({
          y: Math.max(0, formOffset.current + descriptionOffset.current - 12),
          animated: true,
        }),
    )();
  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ListingFormHeader
          isScrolled={isScrolled}
          savedAt={savedAt}
          isDirty={isDirty}
          onBack={handlePrevious}
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
          <ListingFormStepper step={4} />
          <View className="gap-1.5">
            <Text
              accessibilityRole="header"
              className="font-pretendard-bold text-2xl leading-8 text-motu-text-primary"
            >
              증빙 자료
            </Text>
            <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
              파일과 링크를 합산해 최대 10개까지 등록할 수 있습니다.
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
              attachmentError={attachmentError}
              isPicking={picker.isPicking}
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
          {!errors.description && <View className="min-h-1 flex-1" />}
          <View className={`gap-1.5 ${errors.description ? 'pt-2' : ''}`}>
            <Pressable
              accessibilityRole="button"
              disabled={picker.isPicking}
              onPress={handleSave}
              className="h-8 items-center justify-center"
            >
              <Text className="font-pretendard-medium text-xs leading-4 text-motu-grey underline">
                임시 저장
              </Text>
            </Pressable>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Button
                  title="이전"
                  variant="secondary"
                  onPress={handlePrevious}
                  disabled={picker.isPicking}
                />
              </View>
              <View className="flex-1">
                <Button
                  title="다음"
                  onPress={handleNext}
                  disabled={!canProceed || picker.isPicking}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ListingEvidenceModal
        isHelpVisible={isHelpVisible}
        isDeleteVisible={isDeleteVisible}
        item={selectedItem}
        onClose={handleCloseModal}
        onDelete={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}
