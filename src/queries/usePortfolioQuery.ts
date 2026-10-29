import { useQuery } from '@tanstack/react-query';

import { getPortfolio } from '@/apis/portfolio';
import { useAuthStore } from '@/stores/useAuthStore';
import { toPortfolio } from '@/utils/portfolio';

// 포트폴리오는 회원만 조회할 수 있습니다.
export const usePortfolioQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ['portfolio'],
    queryFn: getPortfolio,
    select: toPortfolio,
    enabled: isLoggedIn,
  });
};
