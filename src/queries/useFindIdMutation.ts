import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { z } from 'zod';

import { postFindLoginId, postSendFindIdCode } from '@/apis/accountRecovery';
import type { findIdDeliverySchema } from '@/schemas/findIdApiSchema';

const getDeliveryKey = (email: string) => ['auth', 'findId', 'delivery', email.trim()] as const;

export function useFindIdDeliveryQuery(email: string) {
  const client = useQueryClient();
  const key = getDeliveryKey(email);
  const query = useQuery<z.infer<typeof findIdDeliverySchema> | null>({
    queryKey: key,
    queryFn: () => null,
    enabled: false,
    gcTime: 0,
  });
  return { ...query, clear: () => client.setQueryData(key, null) };
}

export function useSendFindIdCodeMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: postSendFindIdCode,
    retry: false,
    onSuccess: (data, { email }) => {
      client.setQueryData(getDeliveryKey(email), data);
    },
  });
}

export const useFindLoginIdMutation = () =>
  useMutation({ mutationFn: postFindLoginId, retry: false });
