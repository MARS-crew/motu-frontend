import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ListingBasicInfoFields } from '@/components/listingApplication/ListingBasicInfoFields';
import { ListingFormHeader } from '@/components/listingApplication/ListingFormHeader';
import { ListingFormStepper } from '@/components/listingApplication/ListingFormStepper';
import { ListingImageSourceSheet } from '@/components/listingApplication/ListingImageSourceSheet';
import { EMPTY_LISTING_BASIC_INFO } from '@/constants/listingBasicInfoPreview';
import { useListingImagePicker } from '@/hooks/useListingImagePicker';
import {
  listingBasicInfoSchema,
  type ListingBasicInfoForm,
} from '@/schemas/listingBasicInfoSchema';
import { useListingDraftStore } from '@/stores/useListingDraftStore';

export default function ListingBasicInfoScreen() {
  const { draftId } = useLocalSearchParams<{ draftId?: string }>();
  const [currentDraftId] = useState(() => draftId || `draft-${Date.now()}`);
  const [initialDraft] = useState(() => useListingDraftStore.getState().drafts[currentDraftId]);
  const [savedAt, setSavedAt] = useState<string | null>(initialDraft?.savedAt ?? null);
  const saveDraft = useListingDraftStore((state) => state.saveDraft);
  const scrollRef = useRef<ScrollView>(null);
  const fieldOffsets = useRef<Partial<Record<keyof ListingBasicInfoForm, number>>>({});
  const formOffset = useRef(0);
  const {
    control,
    getValues,
    setValue,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ListingBasicInfoForm>({
    resolver: zodResolver(listingBasicInfoSchema),
    defaultValues: initialDraft?.values ?? EMPTY_LISTING_BASIC_INFO,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });
  const picker = useListingImagePicker({
    onSelect: (field, file) => setValue(field, file, { shouldDirty: true, shouldValidate: true }),
    onError: (field, message) => setError(field, { type: 'file', message }),
  });
  const handleBack = () =>
    router.canGoBack() ? router.back() : router.replace('/listing-application');
  const handleSave = () => {
    const values = getValues();
    setSavedAt(saveDraft(currentDraftId, values));
    reset(values);
  };
  const handleInvalid = (fieldErrors: FieldErrors<ListingBasicInfoForm>) => {
    const field = (Object.keys(fieldErrors) as (keyof ListingBasicInfoForm)[]).sort(
      (a, b) => (fieldOffsets.current[a] ?? 0) - (fieldOffsets.current[b] ?? 0),
    )[0];
    if (field)
      scrollRef.current?.scrollTo({
        y: Math.max(0, formOffset.current + (fieldOffsets.current[field] ?? 0) - 12),
        animated: true,
      });
  };
  const handleNext = () =>
    void handleSubmit(() => {
      handleSave();
      router.push({
        pathname: '/listing-application/trading-info',
        params: { draftId: currentDraftId },
      });
    }, handleInvalid)();

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ListingFormHeader savedAt={savedAt} isDirty={isDirty} onBack={handleBack} />
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="gap-6 px-6 pb-7 pt-3"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ListingFormStepper step={1} />
          <View className="gap-1.5">
            <Text
              accessibilityRole="header"
              className="font-pretendard-bold text-2xl leading-8 text-motu-text-primary"
            >
              상품 기본 정보
            </Text>
            <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
              * 표시는 필수 입력 항목입니다.
            </Text>
          </View>
          <View
            className="gap-4"
            onLayout={(event) => {
              formOffset.current = event.nativeEvent.layout.y;
            }}
          >
            <ListingBasicInfoFields
              control={control}
              errors={errors}
              onFieldLayout={(field, offset) => {
                fieldOffsets.current[field] = offset;
              }}
              onImagePress={picker.handleOpen}
            />
          </View>
          <View className="gap-1.5">
            <Pressable
              accessibilityRole="button"
              onPress={handleSave}
              disabled={picker.isPicking}
              className="h-8 items-center justify-center"
            >
              <Text className="font-pretendard-medium text-xs leading-4 text-motu-grey underline">
                임시 저장
              </Text>
            </Pressable>
            <Button title="다음" onPress={handleNext} disabled={picker.isPicking} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ListingImageSourceSheet
        isVisible={picker.targetField !== null}
        isPicking={picker.isPicking}
        onClose={picker.handleClose}
        onLibraryPress={() => void picker.handlePick('library')}
        onFilePress={() => void picker.handlePick('files')}
      />
    </SafeAreaView>
  );
}
