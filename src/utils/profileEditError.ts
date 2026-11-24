import { getAuthError } from '@/utils/authError';

const DEFAULT_ERROR_MESSAGE = '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.';

const PROFILE_EDIT_ERROR_MESSAGES: Record<string, string> = {
  VERIFICATION_CODE_MISMATCH: '인증번호가 일치하지 않습니다. 다시 확인해 주세요.',
  VERIFICATION_EXPIRED: '인증번호가 만료되었습니다. 인증번호를 다시 받아 주세요.',
  VERIFICATION_NOT_FOUND: '인증 요청을 찾을 수 없습니다. 인증번호를 다시 받아 주세요.',
  VERIFICATION_ATTEMPTS_EXCEEDED: '인증 시도 횟수를 초과했습니다. 인증번호를 다시 받아 주세요.',
  VERIFICATION_REQUIRED: '인증이 만료되었습니다. 처음부터 다시 인증해 주세요.',
  USER_SAME_PHONE_NUMBER: '현재 연락처와 같은 번호입니다. 다른 번호를 입력해 주세요.',
};

// 회원정보 수정 API 오류를 화면 문구로 바꿉니다. 오류가 없으면 null입니다.
export function getProfileEditErrorMessage(error: unknown, fallback = DEFAULT_ERROR_MESSAGE) {
  if (!error) return null;
  const serverError = getAuthError(error);
  if (!serverError) return fallback;
  return PROFILE_EDIT_ERROR_MESSAGES[serverError.code] ?? serverError.message ?? fallback;
}
