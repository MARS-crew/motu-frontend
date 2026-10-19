import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
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
import { useListingDraftStore } from '@/stores/useListingDraftStore';

export default function ListingTradingInfoScreen() {
  const { draftId } = useLocalSearchParams<{ draftId?: string }>();
  const [currentDraftId] = useState(() => draftId || `draft-${Date.now()}`);
  const [initialDraft] = useState(() => useListingDraftStore.getState().drafts[currentDraftId]);
  const [savedAt, setSavedAt] = useState<string | null>(
    initialDraft?.tradingValues ? initialDraft.savedAt : null,
  );
  const saveTradingDraft = useListingDraftStore((state) => state.saveTradingDraft);
  const scrollRef = useRef<ScrollView>(null);
  const formOffset = useRef(0);
  const fieldOffsets = useRef<Partial<Record<keyof ListingTradingInfoForm, number>>>({});
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ListingTradingInfoForm>({
    resolver: zodResolver(listingTradingInfoSchema),
    defaultValues: initialDraft?.tradingValues ?? EMPTY_LISTING_TRADING_INFO,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });
  const handleSave = () => {
    const values = getValues();
    setSavedAt(saveTradingDraft(currentDraftId, values));
    reset(values);
  };
  const handlePrevious = () => {
    handleSave();
    router.dismissTo({
      pathname: '/listing-application/basic-info',
      params: { draftId: currentDraftId },
    });
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
  const handleNext = () =>
    void handleSubmit(() => {
      handleSave();
      router.push({
        pathname: '/listing-application/service-metrics',
        params: { draftId: currentDraftId },
      });
    }, handleInvalid)();
  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ListingFormHeader savedAt={savedAt} isDirty={isDirty} onBack={handlePrevious} />
        <ScrollView
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
              <Pressable
                accessibilityRole="button"
                onPress={handleSave}
                className="h-8 items-center justify-center"
              >
                <Text className="font-pretendard-medium text-xs leading-4 text-motu-grey underline">
                  임시 저장
                </Text>
              </Pressable>
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Button title="이전" variant="secondary" onPress={handlePrevious} />
                </View>
                <View className="flex-1">
                  <Button title="다음" onPress={handleNext} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
