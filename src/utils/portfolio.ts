import { ASSET_COMPOSITION_COLORS } from '@/constants/portfolioPreview';
import type { AssetCompositionItem, Holding, HoldingSort } from '@/types/portfolio';

// 예수금과 평가금액 상위 종목을 보여주고, 색이 모자라면 나머지 종목은 '기타'로 묶습니다.
export const getAssetComposition = (cash: number, holdings: Holding[]): AssetCompositionItem[] => {
  const sortedHoldings = [...holdings].sort((a, b) => b.valuation - a.valuation);
  const holdingColorCount = ASSET_COMPOSITION_COLORS.length - 1;
  const hasOthers = sortedHoldings.length > holdingColorCount;
  const visibleHoldings = sortedHoldings.slice(
    0,
    hasOthers ? holdingColorCount - 1 : holdingColorCount,
  );
  const othersValue = sortedHoldings
    .slice(visibleHoldings.length)
    .reduce((sum, holding) => sum + holding.valuation, 0);

  const items = [
    { label: '예수금', value: cash },
    ...visibleHoldings.map((holding) => ({ label: holding.name, value: holding.valuation })),
    ...(hasOthers ? [{ label: '기타', value: othersValue }] : []),
  ];

  return items.map((item, index) => ({ ...item, color: ASSET_COMPOSITION_COLORS[index] }));
};

export const sortHoldings = (holdings: Holding[], sort: HoldingSort) => {
  const sorted = [...holdings];
  switch (sort) {
    case 'rateDesc':
      return sorted.sort((a, b) => b.returnRate - a.returnRate);
    case 'rateAsc':
      return sorted.sort((a, b) => a.returnRate - b.returnRate);
    case 'volume':
      return sorted.sort((a, b) => b.volume - a.volume);
    case 'listedAt':
      return sorted.sort((a, b) => b.listedAt.localeCompare(a.listedAt));
    default:
      return sorted.sort((a, b) => b.valuation - a.valuation);
  }
};
