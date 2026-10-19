import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useRef, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ListingBasicInfoFields } from '@/components/listingApplication/ListingBasicInfoFields';
import { ListingImageSourceSheet } from '@/components/listingApplication/ListingImageSourceSheet';
import { EMPTY_LISTING_BASIC_INFO } from '@/constants/listingBasicInfoPreview';
import { useListingImagePicker } from '@/hooks/useListingImagePicker';
import {
  listingBasicInfoSchema,
  type ListingBasicInfoForm,
} from '@/schemas/listingBasicInfoSchema';
import { useListingDraftStore } from '@/stores/useListingDraftStore';

cssInterop(Image, { className: 'style' });

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
  // 다음 단계 화면은 별도 작업입니다. 현재 단계의 검증과 임시 저장까지 처리합니다.
  const handleNext = () => void handleSubmit(handleSave, handleInvalid)();

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-row items-center gap-[14px] px-5 pb-5 pt-8">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로가기"
            onPress={handleBack}
            hitSlop={10}
          >
            <Image
              source={require('../../assets/icons/listingApplication/form/backArrow.svg')}
              className="h-6 w-6"
              contentFit="contain"
            />
          </Pressable>
          <Text
            accessibilityRole="header"
            className="flex-1 font-pretendard-bold text-lg leading-6 text-motu-text-primary"
          >
            상장 신청
          </Text>
          <View accessibilityLiveRegion="polite" className="flex-row items-center gap-1">
            {savedAt && !isDirty && (
              <Image
                source={require('../../assets/icons/listingApplication/form/savedCheck.svg')}
                className="h-[14px] w-[14px]"
                contentFit="contain"
              />
            )}
            <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
              {savedAt && !isDirty ? `임시 저장됨 ${savedAt}` : '작성 중'}
            </Text>
          </View>
        </View>
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="gap-6 px-6 pb-7 pt-3"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            accessibilityLabel="신청서 작성 4단계 중 1단계"
            className="h-[14px] flex-row items-center gap-1.5"
          >
            {[0, 1, 2, 3].map((step) => (
              <View
                key={step}
                className={`h-1 flex-1 rounded-full ${step === 0 ? 'bg-motu-black' : 'bg-motu-border'}`}
              />
            ))}
            <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-text-tertiary">
              1/4
            </Text>
          </View>
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
