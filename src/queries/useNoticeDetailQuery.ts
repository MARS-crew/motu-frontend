import { useQuery } from '@tanstack/react-query';

import { getNoticeDetail } from '@/apis/notice';
import { toNoticeDetail } from '@/utils/notice';

export const useNoticeDetailQuery = (noticeId: number) =>
  useQuery({
    queryKey: ['notices', 'detail', noticeId],
    queryFn: () => getNoticeDetail(noticeId),
    select: toNoticeDetail,
    enabled: Number.isInteger(noticeId),
  });
