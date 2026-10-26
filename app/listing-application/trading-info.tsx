import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ListingFormHeader } from '@/components/listingApplication/ListingFormHeader';
import { ListingFormStepper } from '@/components/listingApplication/ListingFormStepper';
import { ListingTradingInfoFields } from '@/components/listingApplication/ListingTradingInfoFields';
import { EMPTY_LISTING_TRADING_INFO } from '@/constants/listingTradingInfoPreview';
import {
  listingTradingInfoSchema,
  type ListingTradingInfoForm,
} from '@/schemas/listingTradingInfoSchema';
import { useListingTradingDraftQuery } from '@/queries/useListingTradingDraftQuery';
import { useSaveListingTradingDraftMutation } from '@/queries/useSaveListingTradingDraftMutation';
import { toListingTradingForm } from '@/utils/listingTradingDraft';
import { getListingTradingInfoError } from '@/utils/listingTradingInfoError';
import { getApiErrorMessage } from '@/utils/apiError';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function ListingTradingInfoScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { draftId } = useLocalSearchParams<{ draftId?: string }>();
  const parsedId = Number(draftId);
  const currentDraftId = Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
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
  const formOffset = useRef(0);
  const fieldOffsets = useRef<Partial<Record<keyof ListingTradingInfoForm, number>>>({});
  const {
    control,
    getValues,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ListingTradingInfoForm>({
    resolver: zodResolver(listingTradingInfoSchema),
    defaultValues: { ...EMPTY_LISTING_TRADING_INFO, tradingStartAt: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });
  const saveMutation = useSaveListingTradingDraftMutation();
  const draftQuery = useListingTradingDraftQuery(currentDraftId, saveMutation.isPending);
  const hasLoadError = currentDraftId === null || draftQuery.isError;
  const isBusy = saveMutation.isPending || (!draftQuery.data && !hasLoadError);
  const canSave = !isBusy && !hasLoadError;
  const savedAt = draftQuery.data?.lastSavedAt
    ? new Date(draftQuery.data.lastSavedAt).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : null;
  const loadErrorMessage =
    currentDraftId === null
      ? '올바른 신청서 번호가 아닙니다. 목록에서 다시 열어 주세요.'
      : draftQuery.isError
        ? getApiErrorMessage(draftQuery.error)
        : null;
  useEffect(() => {
    if (!draftQuery.data || saveMutation.isPending || hydratedId.current === currentDraftId) return;
    hydratedId.current = currentDraftId;
    reset(toListingTradingForm(draftQuery.data));
  }, [draftQuery.data, saveMutation.isPending, currentDraftId, reset]);
  const persist = async (values: ListingTradingInfoForm, destination?: 'previous' | 'next') => {
    if (!canSave || currentDraftId === null || requestLock.current) return;
    requestLock.current = true;
    clearErrors();
    try {
      const result = await saveMutation.mutateAsync({
        id: currentDraftId,
        values,
        validateStep: destination === 'next',
      });
      if (!isMounted.current) return;
      reset(result.values);
      if (destination === 'next')
        router.push({
          pathname: '/listing-application/service-metrics',
          params: { draftId: String(currentDraftId) },
        });
      else if (destination === 'previous')
        router.dismissTo({
          pathname: '/listing-application/basic-info',
          params: { draftId: String(currentDraftId) },
        });
    } catch (error: unknown) {
      if (!isMounted.current) return;
      const failure = getListingTradingInfoError(error);
      for (const [field, message] of Object.entries(failure.fields))
        setError(field as keyof ListingTradingInfoForm, { type: 'server', message });
      setError('root.server', { type: 'server', message: failure.message });
    } finally {
      requestLock.current = false;
    }
  };
  const handleSave = () => {
    void persist(getValues());
  };
  const handlePrevious = () => {
    void persist(getValues(), 'previous');
  };
  const handleBack = () => {
    if (saveMutation.isPending || requestLock.current) return;
    if (hasLoadError || isBusy) {
      if (router.canGoBack()) router.back();
      else router.replace('/listing-application');
      return;
    }
    handlePrevious();
  };
  const handleInvalid = (fieldErrors: FieldErrors<ListingTradingInfoForm>) => {
    const field = (Object.keys(fieldErrors) as (keyof ListingTradingInfoForm)[]).sort(
      (a, b) => (fieldOffsets.current[a] ?? 0) - (fieldOffsets.current[b] ?? 0),
    )[0];
    if (field)
      scrollRef.current?.scrollTo({
        y: Math.max(0, formOffset.current + (fieldOffsets.current[field] ?? 0) - 12),
        animated: true,
      });
  };
  const handleNext = () => {
    if (!canSave) return;
    clearErrors('root');
    void handleSubmit((values) => persist(values, 'next'), handleInvalid)();
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
          <ListingFormStepper step={2} />
          <View className="gap-1.5">
            <Text
              accessibilityRole="header"
              className="font-pretendard-bold text-2xl leading-8 text-motu-text-primary"
            >
              평가·거래 정보
            </Text>
            <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
              입력값은 희망값이며 관리자가 심사 후 최종값을 확정합니다.
            </Text>
          </View>
          <View
            className="gap-4"
            onLayout={(event) => {
              formOffset.current = event.nativeEvent.layout.y;
            }}
          >
            <ListingTradingInfoFields
              control={control}
              errors={errors}
              isSaving={isBusy || hasLoadError}
              onFieldLayout={(field, offset) => {
                fieldOffsets.current[field] = offset;
              }}
            />
          </View>
          <View className="gap-2.5">
            <View className="rounded-[10px] bg-motu-bg-secondary px-[14px] py-3">
              <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
                희망값: 희망 상장가, 최소 주문 수량, 호가 단위, 거래 시작일시. 관리자가 심사 후
                최종값을 확정합니다.
              </Text>
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
                disabled={!canSave}
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
                    disabled={!canSave}
                  />
                </View>
                <View className="flex-1">
                  <Button title="다음" onPress={handleNext} disabled={!canSave} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
