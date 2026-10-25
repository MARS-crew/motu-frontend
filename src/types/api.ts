// 서버는 모든 응답을 { success, data } 형태로 감싸서 내려줍니다.
export type ApiResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};
