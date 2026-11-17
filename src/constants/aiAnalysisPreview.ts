const INVESTMENT_PROFILE = {
  title: '수익 추구형',
  description: 'AI·플랫폼 상품 선호도가 높아요',
};

const HIGH_CONCENTRATION_COACH = {
  title: '포트폴리오 집중도가 높아요',
  description: 'PLI 비중이 전체 보유 자산의 58%입니다. 다양한 카테고리의 상품을 함께 살펴보세요.',
};

export const AI_ANALYSIS_PREVIEWS = {
  result: { profile: INVESTMENT_PROFILE, coach: HIGH_CONCENTRATION_COACH },
  medium: {
    profile: INVESTMENT_PROFILE,
    coach: {
      title: '포트폴리오 집중도가 중간이에요',
      description:
        'PLI 비중이 전체 보유 자산의 35%입니다. 비중이 큰 상품의 가격 변동을 함께 확인해 보세요.',
    },
  },
  low: {
    profile: INVESTMENT_PROFILE,
    coach: {
      title: '포트폴리오 집중도가 낮아요',
      description:
        '가장 큰 비중은 PLI 18%입니다. 지금처럼 여러 카테고리의 상품을 고르게 살펴보세요.',
    },
  },
  pending: {
    profile: {
      title: '분석 준비 중',
      description: '체결 주문이 10건 이상이면 투자 성향을 분석해요. (현재 4건)',
    },
    coach: HIGH_CONCENTRATION_COACH,
  },
};

export const AI_RECOMMENDATION_PREVIEW = [
  {
    name: 'CloudWorks',
    category: 'SaaS',
    price: 7120,
    reason: 'AI/클라우드 관심도와 유사',
    badgeClassName: 'bg-motu-green',
  },
  {
    name: 'BrainNote',
    category: 'AI',
    price: 8450,
    reason: '최근 AI 상품 거래 비중 반영',
    badgeClassName: 'bg-motu-amber',
  },
  {
    name: 'NEXUS',
    category: '핀테크',
    price: 5430,
    reason: '안정적인 배당 성향 반영',
    badgeClassName: 'bg-motu-slate',
  },
];
