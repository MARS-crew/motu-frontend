import { api } from '@/apis/instance';
import type { ApiResponse } from '@/types/api';
import type { PortfolioItem } from '@/types/portfolio';

// 총 자산·예수금·평가금액·평가손익·보유 종목을 현재가 기준으로 받습니다.
export const getPortfolio = async () => {
  const { data } = await api.get<ApiResponse<PortfolioItem>>('/portfolio');
  return data.data;
};
