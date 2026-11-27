import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitListing } from '@/apis/listingSubmit';
import { SessionChangedError } from '@/apis/instance';
import type { ListingSubmitRequest } from '@/schemas/listingSubmitSchema';
import { tokenStorage } from '@/utils/tokenStorage';

export function useSubmitListingMutation(id: number) {
  const client = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async (body: ListingSubmitRequest) => {
      const session = tokenStorage.getSessionId();
      const result = await submitListing(id, body);
      if (session !== tokenStorage.getSessionId()) throw new SessionChangedError();
      await client.invalidateQueries({ queryKey: ['listing-applications'] });
      if (session !== tokenStorage.getSessionId()) throw new SessionChangedError();
      return result;
    },
  });
}
