import { api } from '@/apis/instance';
import type { ApiResponse } from '@/types/api';
import type { NoticeDetailItem, NoticeItem, NoticePage } from '@/types/notice';

export const getLatestNotice = async () => {
  const { data } = await api.get<ApiResponse<{ notice: NoticeItem | null }>>('/notices/latest');
  return data.data.notice;
};

type GetNoticesParams = {
  page: number;
  size: number;
};

export const getNotices = async (params: GetNoticesParams) => {
  const { data } = await api.get<ApiResponse<NoticePage>>('/notices', { params });
  return data.data;
};

export const getNoticeDetail = async (noticeId: number) => {
  const { data } = await api.get<ApiResponse<NoticeDetailItem>>(`/notices/${noticeId}`);
  return data.data;
};
