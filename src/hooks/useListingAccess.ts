import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { myInfoQueryOptions, useMyInfoQuery } from '@/queries/useMyInfoQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { getApiErrorMessage } from '@/utils/apiError';
import { getListingRestriction, getListingRestrictionFromError } from '@/utils/listingRestriction';

export function useListingAccess(isEnabled = true) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const query = useMyInfoQuery(isEnabled);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!isLoggedIn) {
      queryClient.removeQueries({ queryKey: myInfoQueryOptions.queryKey });
      queryClient.removeQueries({ queryKey: ['listing-applications', 'drafts'] });
    }
  }, [isLoggedIn, queryClient]);
  const requestLock = useRef(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const restriction = isLoggedIn
    ? query.isError
      ? getListingRestrictionFromError(query.error)
      : getListingRestriction(query.data?.userStatus)
    : null;
  const errorMessage = query.isError && !restriction ? getApiErrorMessage(query.error) : null;

  const verifyAccess = async () => {
    if (!useAuthStore.getState().isLoggedIn) return 'login' as const;
    if (requestLock.current) return 'pending' as const;
    requestLock.current = true;
    setIsVerifying(true);
    try {
      const info = await queryClient.fetchQuery(myInfoQueryOptions);
      return getListingRestriction(info.userStatus)
        ? ('restricted' as const)
        : ('allowed' as const);
    } catch (error: unknown) {
      if (!useAuthStore.getState().isLoggedIn) return 'login' as const;
      return getListingRestrictionFromError(error)
        ? ('restricted' as const)
        : ('unavailable' as const);
    } finally {
      requestLock.current = false;
      setIsVerifying(false);
    }
  };

  return {
    restriction,
    restrictionKey: `${restriction?.label ?? ''}:${query.dataUpdatedAt}:${query.errorUpdatedAt}`,
    errorMessage,
    isLoggedIn,
    isChecking: isLoggedIn && (query.isPending || query.isFetching || isVerifying),
    hasChecked: isLoggedIn && Boolean(query.data) && !restriction,
    verifyAccess,
  };
}
