import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { TopBar } from '@/components/TopBar';
import { ListingAdminOpinion } from '@/components/listingApplication/ListingAdminOpinion';
import { ListingApplicationInfoCard } from '@/components/listingApplication/ListingApplicationInfoCard';
import { ListingApplicationStatusBadge } from '@/components/listingApplication/ListingApplicationStatusBadge';
import { ListingSupplementEditor } from '@/components/listingApplication/ListingSupplementEditor';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { useListingAccess } from '@/hooks/useListingAccess';
import {
  useListingRevisionQuery,
  useListingRevisionEvidenceQuery,
} from '@/queries/useListingRevisionQuery';
import { useSaveListingRevisionEvidenceMutation } from '@/queries/useSaveListingRevisionEvidenceMutation';
import { useResubmitListingRevisionMutation } from '@/queries/useResubmitListingRevisionMutation';
import { listingEvidenceSchema } from '@/schemas/listingEvidenceSchema';
import {
  canResubmitListing,
  getListingRevisionError,
  toListingRevisionEvidence,
} from '@/utils/listingRevision';
import { formatListingDetailDate, LISTING_DETAIL_STATUSES } from '@/utils/listingApplicationDetail';

type ListingServerSupplementProps = {
  applicationId: number | null;
  mode: 'start' | 'editor' | 'complete';
};

export function ListingServerSupplement({ applicationId, mode }: ListingServerSupplementProps) {
  const { revisionId: revisionParam, evidenceCollectionId } = useLocalSearchParams<{
    revisionId?: string;
    evidenceCollectionId?: string;
  }>();
  const { isScrolled, handleScroll } = useHeaderScroll();
  const access = useListingAccess();
  const contextQuery = useListingRevisionQuery(applicationId);
  const context = contextQuery.data;
  const revision = context?.revision;
  const application = context?.application;
  const [createdCollectionId, setSavedId] = useState<string | null>(null);
  const savedId = evidenceCollectionId ?? createdCollectionId;
  const evidenceQuery = useListingRevisionEvidenceQuery(savedId);
  const saveMutation = useSaveListingRevisionEvidenceMutation(
    applicationId ?? 0,
    revision?.id ?? 0,
  );
  const resubmitMutation = useResubmitListingRevisionMutation(
    applicationId ?? 0,
    revision?.id ?? 0,
  );
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now);
  const lock = useRef(false);
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  const isBusy = saveMutation.isPending || resubmitMutation.isPending;
  const isMatchingRevision = !revisionParam || String(revision?.id) === revisionParam;
  const canEdit = Boolean(
    context && isMatchingRevision && canResubmitListing(context.application, context.revision, now),
  );
  const collection = savedId ? evidenceQuery.data : application?.attachments.evidence;
  const values = toListingRevisionEvidence(collection ?? null);
  const canSubmit =
    canEdit &&
    listingEvidenceSchema.safeParse(values).success &&
    !isBusy &&
    (!savedId || evidenceQuery.isSuccess);
  const routeParams = {
    applicationId: String(applicationId),
    revisionId: String(revision?.id),
    ...(savedId ? { evidenceCollectionId: savedId } : {}),
  };
  const handleBack = () => {
    if (lock.current || isBusy) return;
    router.dismissTo({
      pathname: '/listing-application/application-detail',
      params: { applicationId: String(applicationId) },
    });
  };
  const handleResubmit = async () => {
    if (!canSubmit || lock.current) return;
    lock.current = true;
    setError(null);
    try {
      const result = await access.verifyAccess();
      if (result !== 'allowed')
        throw new Error(access.errorMessage ?? '현재 계정으로 재제출할 수 없습니다.');
      let collectionId = savedId;
      if (!collectionId) {
        const saved = await saveMutation.mutateAsync(values);
        collectionId = saved.id;
        setSavedId(collectionId);
        router.setParams({ evidenceCollectionId: collectionId, revisionId: String(revision?.id) });
      }
      const submitted = await resubmitMutation.mutateAsync(collectionId);
      router.replace({
        pathname: '/listing-application/supplement-complete',
        params: {
          applicationId: String(submitted.applicationId),
          revisionId: String(submitted.revision.id),
        },
      });
    } catch (failure: unknown) {
      setError(getListingRevisionError(failure));
    } finally {
      lock.current = false;
    }
  };
  const loadError =
    applicationId === null
      ? '올바른 신청서 번호가 아닙니다.'
      : contextQuery.isError
        ? getListingRevisionError(contextQuery.error)
        : savedId && evidenceQuery.isError
          ? getListingRevisionError(evidenceQuery.error)
          : !access.isLoggedIn
            ? '로그인 후 보완 요청을 확인해 주세요.'
            : context && !isMatchingRevision
              ? '보완 요청이 변경되었습니다. 신청 상세에서 다시 열어 주세요.'
              : null;
  const isLoading = !loadError && (!context || (savedId !== null && !evidenceQuery.data));

  if (!loadError && !isLoading && revision?.resubmittedAt && mode === 'start' && !isBusy)
    return (
      <Redirect
        href={{ pathname: '/listing-application/supplement-complete', params: routeParams }}
      />
    );
  if (
    !loadError &&
    !isLoading &&
    mode === 'editor' &&
    application?.status === 'REVISION_REQUESTED' &&
    revision &&
    !revision.resubmittedAt
  )
    return (
      <SafeAreaView className="flex-1 bg-motu-bg">
        <ListingSupplementEditor
          key={`${applicationId}-${revision.id}-${savedId ?? 'original'}`}
          applicationId={String(applicationId)}
          initialValues={values}
          canSubmit={canEdit}
          onBack={() =>
            router.dismissTo({ pathname: '/listing-application/supplement', params: routeParams })
          }
          onSave={async (input) => {
            const saved = await saveMutation.mutateAsync(input);
            router.dismissTo({
              pathname: '/listing-application/supplement',
              params: { ...routeParams, evidenceCollectionId: saved.id },
            });
          }}
        />
      </SafeAreaView>
    );
  const hasCompleteResult = mode === 'complete' && Boolean(revision?.resubmittedAt);
  const unavailable = !isLoading && !loadError && !hasCompleteResult && !canEdit;
  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      {mode === 'complete' ? (
        <View className="h-[76px]" />
      ) : (
        <TopBar
          title="보완 자료 재제출"
          isScrolled={isScrolled}
          variant="listing-detail"
          onBack={handleBack}
        />
      )}
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerClassName="flex-grow gap-5 px-6 pb-7 pt-3"
        showsVerticalScrollIndicator={false}
      >
        {loadError ? (
          <Text
            accessibilityLiveRegion="polite"
            className="font-pretendard-medium text-sm leading-5 text-motu-red"
          >
            {loadError}
          </Text>
        ) : isLoading ? (
          <Text className="font-pretendard-medium text-sm leading-5 text-motu-text-secondary">
            보완 요청을 불러오고 있습니다.
          </Text>
        ) : application && revision ? (
          <>
            <View className="self-start">
              <ListingApplicationStatusBadge status={LISTING_DETAIL_STATUSES[application.status]} />
            </View>
            <View className={hasCompleteResult ? 'gap-2.5' : 'gap-1.5'}>
              <Text
                accessibilityRole="header"
                className={
                  hasCompleteResult
                    ? 'font-pretendard-bold text-[34px] leading-[42px] text-motu-text-primary'
                    : 'font-pretendard-bold text-2xl leading-8 text-motu-text-primary'
                }
              >
                {hasCompleteResult ? '보완 자료 제출 완료' : '보완 자료를 제출해 주세요.'}
              </Text>
              <Text className="font-pretendard-medium text-sm leading-5 text-motu-text-secondary">
                {hasCompleteResult
                  ? '보완 자료가 제출되었습니다.'
                  : '요청 항목을 수정하거나 파일을 추가한 뒤 재제출합니다.'}
              </Text>
            </View>
            {hasCompleteResult ? (
              <ListingApplicationInfoCard
                rows={[
                  { label: '신청번호', value: application.applicationNumber ?? '-' },
                  { label: '현재 상태', value: application.statusLabel },
                ]}
              />
            ) : (
              <>
                <ListingAdminOpinion opinion={revision.requestContent} />
                <ListingApplicationInfoCard
                  rows={[
                    { label: '보완기한', value: formatListingDetailDate(revision.deadline, false) },
                  ]}
                />
              </>
            )}
            {unavailable && (
              <Text
                accessibilityLiveRegion="polite"
                className="font-pretendard-medium text-xs leading-4 text-motu-red"
              >
                보완 기한이 지났거나 현재 재제출할 수 없는 상태입니다.
              </Text>
            )}
            {error && (
              <Text
                accessibilityLiveRegion="polite"
                className="font-pretendard-medium text-xs leading-4 text-motu-red"
              >
                {error}
              </Text>
            )}
            <View className="min-h-px flex-1" />
            <View className="gap-3">
              {hasCompleteResult ? (
                <>
                  <Button
                    title="내 상장 신청 보기"
                    onPress={() => router.dismissTo('/listing-application/my-applications')}
                  />
                  <Button title="신청 상세 보기" variant="secondary" onPress={handleBack} />
                </>
              ) : (
                <>
                  <Button
                    title="자료 추가·수정"
                    variant="secondary"
                    disabled={!canEdit || isBusy}
                    onPress={() =>
                      router.push({
                        pathname: '/listing-application/supplement-evidence',
                        params: routeParams,
                      })
                    }
                  />
                  <Button
                    title="재제출"
                    disabled={!canSubmit}
                    onPress={() => void handleResubmit()}
                  />
                </>
              )}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
