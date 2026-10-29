import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePriceAlert, patchPriceAlert, postPriceAlert } from '@/apis/priceAlert';

type SavePriceAlertVariables = {
  stockId: number;
  targetPrice: number;
  // 켜져 있는 알림이 있으면 수정하고, 없으면 새로 설정합니다.
  alertId: number | null;
};

export const useSavePriceAlertMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stockId, targetPrice, alertId }: SavePriceAlertVariables) =>
      alertId === null
        ? postPriceAlert({ stockId, targetPrice })
        : patchPriceAlert(alertId, targetPrice),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['price-alerts'] }),
  });
};

export const useDeletePriceAlertMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePriceAlert,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['price-alerts'] }),
  });
};
