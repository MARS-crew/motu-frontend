export type FaqCategory = '거래/주문' | '포인트/자산' | '계정/보안' | '상장' | '기타';

export type FaqFilter = '전체' | FaqCategory;

export type Faq = {
  id: number;
  category: FaqCategory;
  question: string;
  answer: string;
};

// FAQ API 응답 타입입니다. (스웨거 기준)
export type FaqCategoryCode = 'TRADE' | 'POINT' | 'ACCOUNT' | 'LISTING' | 'ETC';

export type FaqFilterCode = 'ALL' | FaqCategoryCode;

export type FaqItem = {
  faqId: number;
  category: FaqCategoryCode;
  question: string;
  answer: string;
};
