import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ListingFormHeader } from '@/components/listingApplication/ListingFormHeader';
import { ListingFormStepper } from '@/components/listingApplication/ListingFormStepper';
import { ListingMetricsHelpModal } from '@/components/listingApplication/ListingMetricsHelpModal';
import { ListingMetricsFields } from '@/components/listingApplication/ListingMetricsFields';
import { EMPTY_LISTING_METRICS } from '@/constants/listingMetricsPreview';
import { listingMetricsSchema, type ListingMetricsForm } from '@/schemas/listingMetricsSchema';
import { useListingDraftStore } from '@/stores/useListingDraftStore';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function ListingMetricsScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { draftId } = useLocalSearchParams<{ draftId?: string }>();
  const [currentDraftId] = useState(() => draftId || `draft-${Date.now()}`);
  const [initialDraft] = useState(() => useListingDraftStore.getState().drafts[currentDraftId]);
  const [savedAt, setSavedAt] = useState<string | null>(
    initialDraft?.metricsValues ? initialDraft.savedAt : null,
  );
  const saveMetricsDraft = useListingDraftStore((state) => state.saveMetricsDraft);
  const [helpType, setHelpType] = useState<'terms' | 'criteria' | null>(null);
  const [hasOpenPopover, setHasOpenPopover] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const formOffset = useRef(0);
  const fieldOffsets = useRef<Partial<Record<keyof ListingMetricsForm, number>>>({});
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ListingMetricsForm>({
    resolver: zodResolver(listingMetricsSchema),
    defaultValues: initialDraft?.metricsValues ?? EMPTY_LISTING_METRICS,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });
  const handleSave = () => {
    const values = getValues();
    setSavedAt(saveMetricsDraft(currentDraftId, values));
    reset(values);
  };
  const handlePrevious = () => {
    handleSave();
    router.dismissTo({
      pathname: '/listing-application/trading-info',
      params: { draftId: currentDraftId },
    });
  };
  const handleInvalid = (fieldErrors: FieldErrors<ListingMetricsForm>) => {
    const field = (Object.keys(fieldErrors) as (keyof ListingMetricsForm)[]).sort(
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
        pathname: '/listing-application/evidence',
        params: { draftId: currentDraftId },
      });
    }, handleInvalid)();
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
          contentContainerClassName={`gap-6 px-6 pt-3 ${hasOpenPopover ? 'pb-[420px]' : 'pb-7'}`}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ListingFormStepper step={3} />
          <View className="gap-1.5">
            <Text
              accessibilityRole="header"
              className="font-pretendard-bold text-2xl leading-8 text-motu-text-primary"
            >
              서비스 주요 지표
            </Text>
            <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
              서비스 규모와 성장성을 보여주는 지표를 입력해 주세요.
            </Text>
          </View>
          <View
            className="z-10 gap-4"
            onLayout={(event) => {
              formOffset.current = event.nativeEvent.layout.y;
            }}
          >
            <ListingMetricsFields
              control={control}
              onHelpPress={setHelpType}
              onPopoverChange={setHasOpenPopover}
              errors={errors}
              onFieldLayout={(field, offset) => {
                fieldOffsets.current[field] = offset;
              }}
            />
          </View>
          <View className="gap-2.5">
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
      <ListingMetricsHelpModal type={helpType} onClose={() => setHelpType(null)} />
    </SafeAreaView>
  );
}
