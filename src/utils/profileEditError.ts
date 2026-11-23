import { getAuthError } from '@/utils/authError';

const DEFAULT_ERROR_MESSAGE = '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.';

const PROFILE_EDIT_ERROR_MESSAGES: Record<string, string> = {
  VERIFICATION_CODE_MISMATCH: '인증번호가 일치하지 않습니다. 다시 확인해 주세요.',
};

// 회원정보 수정 API 오류를 화면 문구로 바꿉니다. 오류가 없으면 null입니다.
export function getProfileEditErrorMessage(error: unknown, fallback = DEFAULT_ERROR_MESSAGE) {
  if (!error) return null;
  const serverError = getAuthError(error);
  if (!serverError) return fallback;
  return PROFILE_EDIT_ERROR_MESSAGES[serverError.code] ?? serverError.message ?? fallback;
}
