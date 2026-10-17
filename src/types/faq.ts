export type FaqCategory = '거래/주문' | '포인트/자산' | '계정/보안' | '상장' | '기타';

export type FaqFilter = '전체' | FaqCategory;

export type Faq = {
  id: number;
  category: FaqCategory;
  question: string;
  answer: string;
};
