import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getNotices } from '@/apis/notice';
import { NOTICE_PAGE_SIZE } from '@/constants/notice';
import { toNoticeListItem } from '@/utils/notice';

export const useNoticesQuery = (page: number) =>
  useQuery({
    queryKey: ['notices', 'list', page],
    queryFn: () => getNotices({ page, size: NOTICE_PAGE_SIZE }),
    select: (data) => ({
      notices: data.items.map(toNoticeListItem),
      totalPages: Math.ceil(data.totalCount / NOTICE_PAGE_SIZE),
    }),
    // 페이지를 넘기는 동안 이전 페이지를 유지해 목록이 깜빡이지 않게 합니다.
    placeholderData: keepPreviousData,
  });
