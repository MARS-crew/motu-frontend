export const LISTING_APPLICATION_STEPS = [
  '서비스 기본 정보',
  '평가·거래 정보',
  '서비스 지표',
  '증빙 자료',
];

export const LISTING_CRITERIA = [
  '운영 주체와 담당자 정보를 입력합니다.',
  '희망 상장가와 거래 기준의 근거를 작성합니다.',
  '서비스 지표와 증빙 자료를 등록합니다.',
  '허위 또는 누락된 정보가 있으면 신청이 반려될 수 있습니다.',
];

// 서버 연동 전 작성 중인 신청서 표시용 데이터
export const LISTING_DRAFT_PREVIEW = [
  {
    id: 'saas-index',
    name: 'SaaS Index',
    step: '평가·거래',
    progress: '2/4',
    savedAt: '09.19 14:30',
  },
  {
    id: 'cloud-works',
    name: 'CloudWorks',
    step: '기본 정보',
    progress: '1/4',
    savedAt: '09.18 11:20',
  },
];

export const MAX_LISTING_DRAFTS = 5;
