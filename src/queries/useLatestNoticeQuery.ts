import { useQuery } from '@tanstack/react-query';

import { getLatestNotice } from '@/apis/notice';

export const useLatestNoticeQuery = () =>
  useQuery({
    queryKey: ['notices', 'latest'],
    queryFn: getLatestNotice,
  });
