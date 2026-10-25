import { isAxiosError } from 'axios';

import type { ApiErrorResponse } from '@/types/api';

const DEFAULT_ERROR_MESSAGE = '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.';

// 서버가 내려준 에러 메시지를 꺼내고, 없으면 기본 문구를 보여줍니다.
export const getApiErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.error?.message ?? DEFAULT_ERROR_MESSAGE;
  }
  return DEFAULT_ERROR_MESSAGE;
};
