export type AccountRestrictionType = 'locked' | 'suspended';

export const ACCOUNT_RESTRICTION_CONTENT = {
  locked: {
    title: '계정이 잠겼습니다',
    description: '비밀번호를 5회 잘못 입력하여\n로그인이 제한되었습니다.',
    help: '로그인 없이 잠금 해제를 문의할 수 있습니다.',
    label: '계정 잠금',
    inquiry: '계정 잠금 해제를 문의합니다.',
  },
  suspended: {
    title: '계정이 정지되었습니다',
    description: '현재 로그인할 수 없습니다.\n정지 해제는 문의를 통해 요청해 주세요.',
    help: '로그인 없이 문의할 수 있습니다.',
    label: '계정 정지',
    inquiry: '계정 정지 해제를 문의합니다.',
  },
} as const;

export const getAccountRestrictionType = (value: string | undefined): AccountRestrictionType =>
  value === 'suspended' ? 'suspended' : 'locked';
