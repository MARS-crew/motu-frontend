import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { TopBar } from '@/components/TopBar';
import { ListingAdminOpinion } from '@/components/listingApplication/ListingAdminOpinion';
import { ListingApplicationInfoCard } from '@/components/listingApplication/ListingApplicationInfoCard';
import { ListingApplicationStatusBadge } from '@/components/listingApplication/ListingApplicationStatusBadge';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { useListingAccess } from '@/hooks/useListingAccess';
import { useListingApplicationDetailQuery } from '@/queries/useListingApplicationDetailQuery';
import { getApiErrorMessage } from '@/utils/apiError';
import { getListingDraftRoute } from '@/utils/listingApplication';
import { getListingDetailRows, LISTING_DETAIL_STATUSES } from '@/utils/listingApplicationDetail';

type ListingFetchedApplicationDetailProps = { id: number | null };

const STATUS_MESSAGES = {
  DRAFT: '작성 중인 신청서입니다. 이어서 작성하여 신청서를 완성해 주세요.',
  SUBMITTED: '신청서가 접수되었습니다. 검토가 시작되면 상태가 검토중으로 변경됩니다.',
  UNDER_REVIEW: '현재 관리자 검토가 진행 중입니다.',
  REVISION_REQUESTED: '보완 요청 내용을 확인해 주세요.',
  APPROVED: '상장 신청이 승인되었습니다.',
  REJECTED: '상장 신청이 반려되었습니다.',
  EXPIRED: '신청서의 임시저장 기간이 만료되었습니다.',
} as const;

export function ListingFetchedApplicationDetail({ id }: ListingFetchedApplicationDetailProps) {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const query = useListingApplicationDetailQuery(id);
  const access = useListingAccess();
  const application = query.data;
  const handleBack = () =>
    router.canGoBack() ? router.back() : router.replace('/listing-application/my-applications');
  const handleContinue = async () => {
    if (!application || application.status !== 'DRAFT' || !application.isEditable) return;
    const result = await access.verifyAccess();
    if (result === 'login') router.push('/(auth)/login');
    else if (result === 'restricted') router.dismissTo('/listing-application');
    else if (result === 'allowed')
      router.push({
        pathname: getListingDraftRoute(application.currentStep),
        params: { draftId: String(application.id) },
      });
  };
  const errorMessage =
    id === null
      ? '올바른 신청서 번호가 아닙니다. 목록에서 다시 열어 주세요.'
      : !access.isLoggedIn
        ? '로그인 후 신청서 정보를 확인해 주세요.'
        : query.isError
          ? getApiErrorMessage(query.error)
          : null;

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar
        isScrolled={isScrolled}
        title="신청 상세"
        variant="listing-detail"
        onBack={handleBack}
      />
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerClassName="flex-grow gap-5 px-6 pb-7 pt-3"
        showsVerticalScrollIndicator={false}
      >
        {errorMessage ? (
          <>
            <Text
              accessibilityLiveRegion="polite"
              className="font-pretendard-medium text-sm leading-5 text-motu-red"
            >
              {errorMessage}
            </Text>
            {id !== null && access.isLoggedIn && (
              <Button
                title="다시 조회"
                variant="secondary"
                onPress={() => void query.refetch()}
                disabled={query.isFetching}
              />
            )}
          </>
        ) : !application ? (
          <Text
            accessibilityLiveRegion="polite"
            className="font-pretendard-medium text-sm leading-5 text-motu-text-secondary"
          >
            신청서 정보를 불러오고 있습니다.
          </Text>
        ) : (
          <>
            <View className="flex-row items-center gap-2">
              <Text
                accessibilityRole="header"
                className="min-w-0 flex-1 font-pretendard-bold text-2xl leading-8 text-motu-text-primary"
              >
                {application.data.serviceName?.trim() || '서비스명 미입력'}
              </Text>
              <ListingApplicationStatusBadge status={LISTING_DETAIL_STATUSES[application.status]} />
            </View>
            <ListingApplicationInfoCard rows={getListingDetailRows(application)} />
            {application.reviewComment ? (
              <ListingAdminOpinion opinion={application.reviewComment} />
            ) : (
              <View className="min-h-14 rounded-[10px] bg-motu-bg-secondary px-3.5 py-3">
                <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
                  {STATUS_MESSAGES[application.status]}
                </Text>
              </View>
            )}
            {application.status === 'REVISION_REQUESTED' && (
              <>
                <View className="min-h-px flex-1" />
                <Button
                  title="보완 자료 작성"
                  onPress={() =>
                    router.push({
                      pathname: '/listing-application/supplement',
                      params: { applicationId: String(application.id) },
                    })
                  }
                />
              </>
            )}
            {application.status === 'DRAFT' && application.isEditable && (
              <>
                <View className="min-h-px flex-1" />
                {access.errorMessage && (
                  <Text
                    accessibilityLiveRegion="polite"
                    className="font-pretendard-medium text-xs leading-4 text-motu-red"
                  >
                    {access.errorMessage}
                  </Text>
                )}
                <Button
                  title="이어서 작성"
                  onPress={() => void handleContinue()}
                  disabled={access.isChecking}
                />
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
