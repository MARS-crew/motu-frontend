import { api } from '@/apis/instance';
import type { ApiResponse } from '@/types/api';
import type { FaqFilterCode, FaqItem } from '@/types/faq';

export const getFaqs = async (category: FaqFilterCode) => {
  const { data } = await api.get<ApiResponse<{ items: FaqItem[] }>>('/faqs', {
    params: { category },
  });
  return data.data.items;
};
