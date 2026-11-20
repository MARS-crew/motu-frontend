import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { postSignupEmail, postConfirmSignupEmail, postSignup } from '@/apis/signup';
import { verificationDeliverySchema } from '@/schemas/loginVerificationSchema';
import type { SignupResponse } from '@/schemas/signupRequestSchema';

const getDeliveryKey = (email: string) => ['signup', 'emailDelivery', email] as const;
export const SIGNUP_RESULT_KEY = ['signup', 'result'] as const;

export const useSignupEmailDeliveryQuery = (email: string) =>
  useQuery<z.infer<typeof verificationDeliverySchema> | null>({
    queryKey: getDeliveryKey(email),
    queryFn: () => null,
    enabled: false,
    gcTime: 0,
  });

export function useSendSignupEmailMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: postSignupEmail,
    retry: false,
    onSuccess: (data, email) => {
      client.setQueryData(getDeliveryKey(email), data);
    },
  });
}
export const useConfirmSignupEmailMutation = () =>
  useMutation({ mutationFn: postConfirmSignupEmail, retry: false });

export function useSignupMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: postSignup,
    retry: false,
    onSuccess: (data) => {
      client.setQueryData(SIGNUP_RESULT_KEY, data);
    },
  });
}

export const useSignupResultQuery = () =>
  useQuery<SignupResponse | null>({
    queryKey: SIGNUP_RESULT_KEY,
    queryFn: () => null,
    enabled: false,
    gcTime: 0,
  });
