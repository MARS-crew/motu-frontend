import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router, useIsFocused } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LoginHeader } from '@/components/login/LoginHeader';
import { AuthFlowBadge } from '@/components/login/AuthFlowLayout';
import { ScreenBottomTabBar } from '@/components/BottomTabBar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ListingRestrictionModal } from '@/components/listingApplication/ListingRestrictionModal';
import { useListingDraftsQuery } from '@/queries/useListingDraftsQuery';
import { toListingDraftSummaryItem } from '@/utils/listingDraft';
import { getListingDraftRoute } from '@/utils/listingApplication';
import { useTwoFactorGate } from '@/hooks/useTwoFactorGate';
import { useListingAccess } from '@/hooks/useListingAccess';
import { ListingCriteriaModal } from '@/components/listingApplication/ListingCriteriaModal';
import { LISTING_APPLICATION_STEPS } from '@/constants/listingApplicationPreview';
import {
  listingApplicationEntrySchema,
  type ListingApplicationEntryForm,
} from '@/schemas/listingApplicationSchema';

cssInterop(Image, { className: 'style' });

export default function ListingApplicationEntryScreen() {
  const access = useListingAccess();
  const security = useTwoFactorGate();
  const isFocused = useIsFocused();
  const draftsQuery = useListingDraftsQuery(2);
  const summary = draftsQuery.isSuccess ? draftsQuery.data : undefined;
  const draftItems = summary?.items.map(toListingDraftSummaryItem) ?? [];
  const canCreate = Boolean(summary?.canCreate) && !draftsQuery.isFetching;
  const [dismissedRestrictionKey, setDismissedRestrictionKey] = useState<string | null>(null);
  const isRestrictionVisible =
    isFocused && Boolean(access.restriction) && dismissedRestrictionKey !== access.restrictionKey;
  const [isCriteriaVisible, setIsCriteriaVisible] = useState(false);
  const { control, handleSubmit } = useForm<ListingApplicationEntryForm>({
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
      if (result === 'login')
        router.push({ pathname: '/login', params: { returnTo: '/listing-application' } });
      if (result === 'allowed') {
        try {
          if (
            await security.requireVerification({
              kind: 'listing',
              pathname: '/listing-application/basic-info',
              origin: '/listing-application',
            })
          )
            router.push('/listing-application/basic-info');
        } catch {
          /* 상태 조회 실패 시 진입하지 않습니다. */
        }
      }
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
    if (result === 'login')
      router.push({ pathname: '/login', params: { returnTo: '/listing-application' } });
    if (result !== 'allowed') return;
    const pathname = getListingDraftRoute(
      summary?.items.find((draft) => String(draft.id) === draftId)?.currentStep,
    );
    try {
      if (
        !(await security.requireVerification({
          kind: 'listing',
          pathname,
          draftId,
          origin: '/listing-application',
        }))
      )
        return;
    } catch {
      return;
    }
    router.push({
      pathname: getListingDraftRoute(
        summary?.items.find((draft) => String(draft.id) === draftId)?.currentStep,
      ),
      params: { draftId },
    });
  };

  const [preparedSteps, setPreparedSteps] = useState<boolean[]>([false, false, false, false]);
  const currentDraft = draftItems[0];
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-motu-bg">
      <LoginHeader title="상장 신청" onBack={handleBack} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow gap-[14px] px-[24px] pb-[16px] pt-[12px]"
        showsVerticalScrollIndicator={false}
      >
        {access.hasChecked && <AuthFlowBadge>신청 가능 상태</AuthFlowBadge>}
        <View className="gap-[6px]">
          <Text
            accessibilityRole="header"
            className="font-pretendard-bold text-[24px] leading-[32px] text-motu-text-primary text-no-font-padding"
          >
            신청 전에 확인해 주세요.
          </Text>
          <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary text-no-font-padding">
            아래 항목을 모두 준비한 뒤 신청을 시작할 수 있습니다.
          </Text>
        </View>
        <View className="gap-[6px]">
          {LISTING_APPLICATION_STEPS.map((step, index) => (
            <Pressable
              key={step}
              accessibilityRole="checkbox"
              accessibilityLabel={step}
              accessibilityState={{ checked: preparedSteps[index] }}
              onPress={() =>
                setPreparedSteps((values) =>
                  values.map((value, i) => (i === index ? !value : value)),
                )
              }
              className="h-[50px] flex-row items-center gap-[12px] rounded-[12px] border border-motu-border bg-motu-surface-card px-[15px]"
            >
              <View
                className={`h-[22px] w-[22px] items-center justify-center rounded-[6px] border ${preparedSteps[index] ? 'border-motu-success bg-motu-success' : 'border-motu-border bg-motu-bg'}`}
              >
                <Image
                  source={
                    preparedSteps[index]
                      ? require('../../assets/icons/listingApplication/entry/check.svg')
                      : require('../../assets/icons/listingApplication/entry/checkMuted.svg')
                  }
                  className="h-[14px] w-[14px]"
                  contentFit="contain"
                />
              </View>
              <Text className="font-pretendard-medium text-[14px] leading-[20px] text-motu-text-primary text-no-font-padding">
                {step}
              </Text>
            </Pressable>
          ))}
        </View>
        {currentDraft && (
          <View className="gap-[12px] rounded-[14px] bg-motu-bg-secondary p-[16px]">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="작성 중 신청서 전체 보기"
              onPress={handleViewAll}
              className="flex-row items-center gap-[8px]"
            >
              <Text className="flex-1 font-pretendard-medium text-[12px] leading-[16px] text-motu-text-secondary text-no-font-padding">
                작성 중 신청서
              </Text>
              <View className="rounded-full bg-motu-tonal px-[12px] py-[6px]">
                <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-black text-no-font-padding">
                  임시 저장
                </Text>
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${currentDraft.name} 신청 상세 보기`}
              onPress={() => handleOpenDraft(currentDraft.id)}
            >
              <Text className="font-pretendard-bold text-[16px] leading-[22px] text-motu-text-primary text-no-font-padding">
                {currentDraft.name}
              </Text>
            </Pressable>
            <Button
              appearance="auth"
              size="md"
              title="이어서 작성"
              disabled={security.isChecking}
              onPress={() => void handleContinue(currentDraft.id)}
            />
          </View>
        )}
        <View className="min-h-[20px] flex-1" />
        <View className="gap-[10px]">
          <Controller
            control={control}
            name="hasConfirmedCriteria"
            render={({ field: { value, onChange } }) => (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityLabel="상장 기준을 확인했습니다."
                accessibilityState={{ checked: value }}
                onPress={() => onChange(!value)}
                onLongPress={handleOpenCriteria}
                className="h-[50px] flex-row items-center gap-[12px] rounded-[12px] border border-motu-border bg-motu-surface-card px-[15px]"
              >
                <View
                  className={`h-[22px] w-[22px] items-center justify-center rounded-[6px] border ${value ? 'border-motu-success bg-motu-success' : 'border-motu-border bg-motu-bg'}`}
                >
                  <Image
                    source={
                      value
                        ? require('../../assets/icons/listingApplication/entry/check.svg')
                        : require('../../assets/icons/listingApplication/entry/checkMuted.svg')
                    }
                    className="h-[14px] w-[14px]"
                    contentFit="contain"
                  />
                </View>
                <Text className="font-pretendard-medium text-[14px] leading-[20px] text-motu-text-primary text-no-font-padding">
                  상장 기준을 확인했습니다.
                </Text>
              </Pressable>
            )}
          />
          <Button
            appearance="auth"
            title="새 신청서 작성"
            disabled={
              !hasConfirmedCriteria || !canCreate || access.isChecking || security.isChecking
            }
            onPress={handleStart}
          />
        </View>
      </ScrollView>
      <ScreenBottomTabBar />
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
