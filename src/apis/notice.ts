import { api } from '@/apis/instance';
import type { ApiResponse } from '@/types/api';
import type { NoticeItem } from '@/types/notice';

export const getLatestNotice = async () => {
  const { data } = await api.get<ApiResponse<{ notice: NoticeItem | null }>>('/notices/latest');
  return data.data.notice;
};
