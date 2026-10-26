import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
import { useListingBasicDraftQuery } from '@/queries/useListingBasicDraftQuery';
import { useSaveListingBasicDraftMutation } from '@/queries/useSaveListingBasicDraftMutation';
import { useSectorsQuery } from '@/queries/useSectorsQuery';
import { toListingBasicForm } from '@/utils/listingBasicDraft';
import { getListingBasicInfoError } from '@/utils/listingBasicInfoError';
import { getApiErrorMessage } from '@/utils/apiError';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function ListingBasicInfoScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { draftId } = useLocalSearchParams<{ draftId?: string }>();
  const parsedId = draftId ? Number(draftId) : null;
  const hasInvalidId = parsedId !== null && (!Number.isSafeInteger(parsedId) || parsedId <= 0);
  const [currentDraftId, setCurrentDraftId] = useState<number | null>(
    hasInvalidId ? null : parsedId,
  );
  const hydratedId = useRef<number | null>(null);
  const requestLock = useRef(false);
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const scrollRef = useRef<ScrollView>(null);
  const fieldOffsets = useRef<Partial<Record<keyof ListingBasicInfoForm, number>>>({});
  const formOffset = useRef(0);
  const {
    control,
    getValues,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ListingBasicInfoForm>({
    resolver: zodResolver(listingBasicInfoSchema),
    defaultValues: EMPTY_LISTING_BASIC_INFO,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });
  const saveMutation = useSaveListingBasicDraftMutation({
    onCreated: (id) => {
      hydratedId.current = id;
      if (!isMounted.current) return;
      setCurrentDraftId(id);
      router.setParams({ draftId: String(id) });
    },
    onImageUploaded: (field, image) => {
      if (isMounted.current) setValue(field, image, { shouldDirty: true });
    },
  });
  const draftQuery = useListingBasicDraftQuery(currentDraftId, saveMutation.isPending);
  const sectorsQuery = useSectorsQuery();
  const isLoadingDraft =
    currentDraftId !== null &&
    (!draftQuery.data || !sectorsQuery.data) &&
    !draftQuery.isError &&
    !sectorsQuery.isError;
  const hasLoadError =
    hasInvalidId || (currentDraftId !== null && (draftQuery.isError || sectorsQuery.isError));
  const isBusy = saveMutation.isPending || isLoadingDraft;
  const canSave = !isBusy && !hasLoadError && !saveMutation.hasUnknownCreation;
  const savedAt = draftQuery.data?.draft.lastSavedAt
    ? new Date(draftQuery.data.draft.lastSavedAt).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : null;
  useEffect(() => {
    if (
      !draftQuery.data ||
      !sectorsQuery.data ||
      saveMutation.isPending ||
      hydratedId.current === currentDraftId
    )
      return;
    hydratedId.current = currentDraftId;
    const { draft, logo, cover } = draftQuery.data;
    reset(toListingBasicForm(draft, sectorsQuery.data, logo, cover));
  }, [draftQuery.data, sectorsQuery.data, saveMutation.isPending, currentDraftId, reset]);
  const picker = useListingImagePicker({
    onSelect: (field, file) => setValue(field, file, { shouldDirty: true, shouldValidate: true }),
    onError: (field, message) => setError(field, { type: 'file', message }),
  });
  const handleBack = () => {
    if (saveMutation.isPending) return;
    if (router.canGoBack()) router.back();
    else router.replace('/listing-application');
  };
  const persist = async (values: ListingBasicInfoForm, validateStep: boolean) => {
    if (!canSave || picker.isPicking || requestLock.current) return;
    requestLock.current = true;
    clearErrors();
    try {
      const result = await saveMutation.mutateAsync({ id: currentDraftId, values, validateStep });
      if (!isMounted.current) return;
      reset(result.values);
      if (validateStep)
        router.push({
          pathname: '/listing-application/trading-info',
          params: { draftId: String(result.draft.id) },
        });
    } catch (error: unknown) {
      if (!isMounted.current) return;
      const failure = getListingBasicInfoError(error);
      for (const [field, message] of Object.entries(failure.fields))
        setError(field as keyof ListingBasicInfoForm, { type: 'server', message });
      setError('root.server', { type: 'server', message: failure.message });
    } finally {
      requestLock.current = false;
    }
  };
  const handleSave = () => {
    void persist(getValues(), false);
  };
  const loadErrorMessage = hasInvalidId
    ? '올바른 신청서 번호가 아닙니다. 목록에서 다시 열어 주세요.'
    : draftQuery.isError
      ? getApiErrorMessage(draftQuery.error)
      : currentDraftId !== null && sectorsQuery.isError
        ? getApiErrorMessage(sectorsQuery.error)
        : null;
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
  const handleNext = () => {
    if (!canSave || picker.isPicking) return;
    clearErrors('root');
    void handleSubmit((values) => persist(values, true), handleInvalid)();
  };

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
          onBack={handleBack}
        />
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
              isSaving={isBusy || hasLoadError}
              onFieldLayout={(field, offset) => {
                fieldOffsets.current[field] = offset;
              }}
              onImagePress={picker.handleOpen}
            />
          </View>
          <View className="gap-1.5">
            {(errors.root?.server?.message || loadErrorMessage) && (
              <Text
                accessibilityLiveRegion="polite"
                className="font-pretendard-medium text-xs leading-4 text-motu-red"
              >
                {errors.root?.server?.message || loadErrorMessage}
              </Text>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={handleSave}
              disabled={picker.isPicking || !canSave}
              className="h-8 items-center justify-center"
            >
              <Text className="font-pretendard-medium text-xs leading-4 text-motu-grey underline">
                임시 저장
              </Text>
            </Pressable>
            <Button title="다음" onPress={handleNext} disabled={picker.isPicking || !canSave} />
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
