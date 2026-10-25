import { useQuery } from '@tanstack/react-query';

import { getFaqs } from '@/apis/faq';
import { FAQ_CATEGORY_LABELS } from '@/constants/faq';
import type { FaqFilterCode } from '@/types/faq';

export const useFaqsQuery = (category: FaqFilterCode) =>
  useQuery({
    queryKey: ['faqs', category],
    queryFn: () => getFaqs(category),
    select: (items) =>
      items.map((faq) => ({
        id: faq.faqId,
        category: FAQ_CATEGORY_LABELS[faq.category],
        question: faq.question,
        answer: faq.answer,
      })),
  });
