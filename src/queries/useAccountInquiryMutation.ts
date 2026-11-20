import { useMutation } from '@tanstack/react-query';

import { postAccountInquiry } from '@/apis/accountInquiry';

export const useAccountInquiryMutation = () =>
  useMutation({ mutationFn: postAccountInquiry, retry: false });
