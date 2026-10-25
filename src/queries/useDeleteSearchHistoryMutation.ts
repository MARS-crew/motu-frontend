import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteAllSearchHistories, deleteSearchHistory } from '@/apis/searchHistory';
import { SEARCH_HISTORIES_QUERY_KEY } from '@/queries/useSearchHistoriesQuery';

export const useDeleteSearchHistoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSearchHistory,
    onSettled: () => queryClient.invalidateQueries({ queryKey: SEARCH_HISTORIES_QUERY_KEY }),
  });
};

export const useDeleteAllSearchHistoriesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllSearchHistories,
    onSettled: () => queryClient.invalidateQueries({ queryKey: SEARCH_HISTORIES_QUERY_KEY }),
  });
};
