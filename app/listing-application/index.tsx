import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router, useIsFocused } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { TopBar } from '@/components/TopBar';
import { ListingRestrictionModal } from '@/components/listingApplication/ListingRestrictionModal';
import { useListingDraftsQuery } from '@/queries/useListingDraftsQuery';
import { toListingDraftSummaryItem } from '@/utils/listingDraft';
import { getListingDraftRoute } from '@/utils/listingApplication';
import { useListingAccess } from '@/hooks/useListingAccess';
import { ListingCriteriaModal } from '@/components/listingApplication/ListingCriteriaModal';
import { LISTING_APPLICATION_STEPS } from '@/constants/listingApplicationPreview';
import {
  listingApplicationEntrySchema,
  type ListingApplicationEntryForm,
} from '@/schemas/listingApplicationSchema';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

cssInterop(Image, { className: 'style' });

export default function ListingApplicationEntryScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const access = useListingAccess();
  const isFocused = useIsFocused();
  const draftsQuery = useListingDraftsQuery(2);
  const summary = draftsQuery.isSuccess ? draftsQuery.data : undefined;
  const draftItems = summary?.items.map(toListingDraftSummaryItem) ?? [];
  const canCreate = Boolean(summary?.canCreate) && !draftsQuery.isFetching;
  const [dismissedRestrictionKey, setDismissedRestrictionKey] = useState<string | null>(null);
  const isRestrictionVisible =
    isFocused && Boolean(access.restriction) && dismissedRestrictionKey !== access.restrictionKey;
  const [isCriteriaVisible, setIsCriteriaVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingApplicationEntryForm>({
    resolver: zodResolver(listingApplicationEntrySchema),
    defaultValues: { hasConfirmedCriteria: false },
    reValidateMode: 'onChange',
  });
  const hasConfirmedCriteria = useWatch({ control, name: 'hasConfirmedCriteria' });
  const handleBack = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)/my'));
  const handleOpenCriteria = () => setIsCriteriaVisible(true);
  const handleCloseCriteria = () => setIsCriteriaVisible(false);
  const handleStart = () => {
    if (!canCreate) return;
    void handleSubmit(async () => {
      const result = await access.verifyAccess();
      if (result === 'restricted') setDismissedRestrictionKey(null);
      if (result === 'login') router.push('/(auth)/login');
      if (result === 'allowed') router.push('/listing-application/basic-info');
    })();
  };
  const handleCloseRestriction = () => setDismissedRestrictionKey(access.restrictionKey);
  const handleRestrictionDetails = () => {
    setDismissedRestrictionKey(access.restrictionKey);
    router.push('/listing-application/restriction');
  };
  const handleOpenDraft = (applicationId: string) =>
    router.push({
      pathname: '/listing-application/application-detail',
      params: { applicationId },
    });
  const handleViewAll = () => router.push('/listing-application/my-applications');
  const handleContinue = async (draftId: string) => {
    const result = await access.verifyAccess();
    if (result === 'restricted') setDismissedRestrictionKey(null);
    if (result === 'login') router.push('/(auth)/login');
    if (result !== 'allowed') return;
    router.push({
      pathname: getListingDraftRoute(
        summary?.items.find((draft) => String(draft.id) === draftId)?.currentStep,
      ),
      params: { draftId },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="상장 신청" onBack={handleBack} />
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerClassName="flex-grow justify-between px-6 pb-6 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text
            accessibilityRole="header"
            className="font-pretendard-bold text-2xl leading-8 text-motu-text-primary"
          >
            신청 전에 확인해 주세요.
          </Text>
          <Text className="mt-1 font-pretendard text-[13px] leading-5 text-motu-text-secondary">
            아래 순서대로 신청서를 작성합니다.
          </Text>
          <View className="mt-[14px] gap-1">
            {LISTING_APPLICATION_STEPS.map((step) => (
              <View
                key={step}
                className="min-h-[42px] flex-row items-center justify-between rounded-xl border border-motu-grey-lighter bg-white px-4 py-2.5"
              >
                <Text className="font-pretendard-medium text-[13px] text-motu-text-primary">
                  {step}
                </Text>
                <Text className="font-pretendard text-[11px] text-motu-grey">입력 예정</Text>
              </View>
            ))}
          </View>
          <View
            className={`mt-3 rounded-xl border bg-white p-4 ${errors.hasConfirmedCriteria ? 'border-motu-red' : 'border-motu-grey-lighter'}`}
          >
            <Pressable
              accessibilityRole="button"
              onPress={handleOpenCriteria}
              className="mb-3 flex-row items-center gap-1 self-start active:opacity-50"
            >
              <Text className="font-pretendard-medium text-[13px] text-motu-text-secondary">
                상장 기준 보기
              </Text>
              <Image
                source={require('../../assets/icons/home/chevronRightSmall.svg')}
                contentFit="contain"
                className="ml-0.5 h-4 w-4"
              />
            </Pressable>
            <Controller
              control={control}
              name="hasConfirmedCriteria"
              render={({ field: { value, onChange } }) => (
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityLabel="상장 기준을 확인했습니다."
                  accessibilityState={{ checked: value }}
                  onPress={() => onChange(!value)}
                  className="flex-row items-center gap-3"
                >
                  <View
                    className={`h-[22px] w-[22px] items-center justify-center rounded-md border ${value ? 'border-motu-black bg-motu-black' : 'border-motu-grey-light bg-white'}`}
                  >
                    {value && (
                      <View className="mb-0.5 h-1.5 w-2.5 -rotate-45 border-b-2 border-l-2 border-white" />
                    )}
                  </View>
                  <Text className="shrink font-pretendard-medium text-sm text-motu-text-primary">
                    상장 기준을 확인했습니다.
                  </Text>
                </Pressable>
              )}
            />
            {(errors.hasConfirmedCriteria || access.errorMessage) && (
              <Text
                accessibilityLiveRegion="polite"
                className="mt-3 font-pretendard text-[11px] text-motu-red"
              >
                {errors.hasConfirmedCriteria?.message ?? access.errorMessage}
              </Text>
            )}
          </View>
          <View className="mt-[14px] font-pretendard-bold">
            <Button
              title="신청 시작"
              size="lg"
              disabled={!hasConfirmedCriteria || !canCreate || access.isChecking}
              onPress={handleStart}
            />
          </View>
        </View>
        <View className="mt-24 rounded-[14px] bg-motu-bg-secondary px-4 py-3">
          <Text className="mb-[10px] font-pretendard text-xs text-motu-grey">
            작성 중인 신청서{' '}
            <Text className="text-motu-grey-light">
              {' '}
              {summary
                ? `${summary.totalCount}/${summary.maxCount}`
                : draftsQuery.isError
                  ? '조회 실패'
                  : '-/-'}
            </Text>
          </Text>
          <View className="rounded-xl bg-white px-[14px]">
            {draftItems.map((draft, index) => (
              <View
                key={draft.id}
                className={`flex-row items-center justify-between gap-1 py-[10px] ${index > 0 ? 'border-t border-motu-grey-lighter' : ''}`}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${draft.name} 신청 상세 보기`}
                  onPress={() => handleOpenDraft(draft.id)}
                  className="flex-1"
                >
                  <Text className="font-pretendard-bold text-[15px] text-motu-black">
                    {draft.name}
                  </Text>
                  <Text className="mt-1 font-pretendard-medium text-[11px] text-motu-grey">
                    임시 저장 · {draft.step} {draft.progress} · {draft.savedAt}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${draft.name} 이어서 작성`}
                  onPress={() => void handleContinue(draft.id)}
                  className="flex-row items-center gap-1"
                >
                  <Text className="font-pretendard-medium text-xs text-motu-grey">이어서 작성</Text>
                  <Image
                    source={require('../../assets/icons/home/chevronRightSmall.svg')}
                    className="h-4 w-4"
                    contentFit="contain"
                  />
                </Pressable>
              </View>
            ))}
          </View>
          <View className="mt-3 flex-row gap-2">
            <Pressable
              accessibilityRole="button"
              onPress={handleViewAll}
              className="min-h-11 flex-1 items-center justify-center rounded-xl border border-motu-grey-lighter bg-white py-3 active:opacity-50"
            >
              <Text className="font-pretendard-bold text-sm text-motu-black">전체 보기</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleStart}
              disabled={!canCreate || access.isChecking}
              className="min-h-11 flex-1 items-center justify-center rounded-xl bg-motu-grey-lighter py-3 active:opacity-50"
            >
              <Text className="font-pretendard-bold text-sm text-motu-black">새 신청서 작성</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <ListingCriteriaModal isVisible={isCriteriaVisible} onClose={handleCloseCriteria} />
      <ListingRestrictionModal
        isVisible={isRestrictionVisible}
        label={access.restriction?.label}
        onClose={handleCloseRestriction}
        onDetailsPress={handleRestrictionDetails}
      />
    </SafeAreaView>
  );
}
