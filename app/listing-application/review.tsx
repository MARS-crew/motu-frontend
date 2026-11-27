import { Image } from 'expo-image';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ListingReviewSummary } from '@/components/listingApplication/ListingReviewSummary';
import { listingSubmissionSchema } from '@/schemas/listingSubmissionSchema';
import { useRef } from 'react';
import { useListingApplicationDetailQuery } from '@/queries/useListingApplicationDetailQuery';
import { useSubmitListingMutation } from '@/queries/useSubmitListingMutation';
import { useSectorsQuery } from '@/queries/useSectorsQuery';
import { listingDraftDetailSchema } from '@/schemas/listingDraftSchema';
import { toListingBasicForm } from '@/utils/listingBasicDraft';
import { toListingTradingForm } from '@/utils/listingTradingDraft';
import { toListingMetricsForm } from '@/utils/listingMetricsDraft';
import { toListingRevisionEvidence } from '@/utils/listingRevision';
import { getAuthError } from '@/utils/authError';
import { useTwoFactorGate } from '@/hooks/useTwoFactorGate';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

cssInterop(Image, { className: 'style' });

export default function ListingReviewScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const security = useTwoFactorGate();
  const { draftId } = useLocalSearchParams<{ draftId?: string }>();
  const id = Number(draftId);
  const isValidId = Number.isSafeInteger(id) && id > 0;
  const query = useListingApplicationDetailQuery(isValidId ? id : null);
  const sectors = useSectorsQuery();
  const submit = useSubmitListingMutation(id);
  const lock = useRef(false);
  const application = query.data;
  const parsed = listingDraftDetailSchema.safeParse(application);
  const saved = parsed.success ? parsed.data : null;
  const draft =
    saved && application
      ? {
          values: toListingBasicForm(
            saved,
            sectors.data ?? [],
            application.attachments.logo,
            application.attachments.mainImage,
          ),
          tradingValues: toListingTradingForm(saved),
          metricsValues: toListingMetricsForm(saved),
          evidenceValues: toListingRevisionEvidence(application.attachments.evidence),
        }
      : null;
  const steps = [
    {
      title: '기본 정보',
      isComplete: listingSubmissionSchema.shape.values.safeParse(draft?.values).success,
    },
    {
      title: '평가·거래 정보',
      isComplete: listingSubmissionSchema.shape.tradingValues.safeParse(draft?.tradingValues)
        .success,
    },
    {
      title: '서비스 지표',
      isComplete: listingSubmissionSchema.shape.metricsValues.safeParse(draft?.metricsValues)
        .success,
    },
    {
      title: '증빙 자료',
      isComplete: listingSubmissionSchema.shape.evidenceValues.safeParse(draft?.evidenceValues)
        .success,
    },
  ];
  const canSubmit =
    query.isSuccess &&
    !query.isFetching &&
    listingSubmissionSchema.safeParse(draft).success &&
    Boolean(draft?.evidenceValues.items.length);
  const handleBack = () => {
    router.dismissTo({ pathname: '/listing-application/evidence', params: { draftId } });
  };
  const handleSubmit = async () => {
    if (!canSubmit || !draftId || !application || lock.current) return;
    lock.current = true;
    try {
      if (
        !(await security.requireVerification({
          kind: 'listing',
          pathname: '/listing-application/review',
          draftId,
        }))
      )
        return;
      await submit.mutateAsync({ expectedLastSavedAt: application.lastSavedAt });
      router.replace({ pathname: '/listing-application/complete', params: { draftId } });
    } catch (error) {
      const code = getAuthError(error)?.code;
      if (code === 'TWO_FACTOR_REQUIRED' || code === 'TWO_FACTOR_NOT_ENABLED') {
        await security
          .requireVerification(
            { kind: 'listing', pathname: '/listing-application/review', draftId },
            undefined,
            true,
          )
          .catch(() => undefined);
      }
    } finally {
      lock.current = false;
    }
  };

  if (!isValidId) return <Redirect href="/listing-application" />;
  if (application && application.status !== 'DRAFT' && application.applicationNumber)
    return <Redirect href={{ pathname: '/listing-application/complete', params: { draftId } }} />;

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <View
        className={`h-[76px] justify-center border-b bg-motu-bg px-5 pb-5 pt-8 ${
          isScrolled ? 'border-motu-grey-lighter' : 'border-transparent'
        }`}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
          onPress={handleBack}
          hitSlop={10}
          className="self-start active:opacity-60"
        >
          <Image
            source={require('../../assets/icons/listingApplication/form/backArrow.svg')}
            className="h-6 w-6"
            contentFit="contain"
          />
        </Pressable>
      </View>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerClassName="flex-grow gap-5 px-6 pb-7 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <Text
          accessibilityRole="header"
          className="font-pretendard-bold text-2xl leading-8 text-motu-text-primary"
        >
          최종 확인
        </Text>
        <View className="gap-1.5">
          <Text className="font-pretendard-bold text-lg leading-6 text-motu-text-primary">
            입력 내용을 확인해 주세요.
          </Text>
          <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
            모든 필수 항목이 완료되어야 제출할 수 있습니다.
          </Text>
        </View>
        <ListingReviewSummary steps={steps} />
        <View className="min-h-px flex-1" />
        <View className="gap-2.5">
          <View className="rounded-[10px] bg-motu-bg-secondary px-3.5 py-3">
            <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
              최종 제출 시 2차 보안 인증 상태를 확인합니다. 미인증·만료 상태이면 인증 완료 후
              접수됩니다.
            </Text>
          </View>
          {getAuthError(submit.error ?? query.error)?.message && (
            <Text
              accessibilityLiveRegion="polite"
              className="font-pretendard-medium text-xs text-motu-btn-red"
            >
              {getAuthError(submit.error ?? query.error)?.message}
            </Text>
          )}
          <Button
            title="최종 제출"
            onPress={() => void handleSubmit()}
            disabled={!canSubmit || security.isChecking || submit.isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
