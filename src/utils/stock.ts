import type { Product } from '@/types/product';
import type { StockItem } from '@/types/stock';

// 상품 API 응답을 공용 상품 목록 아이템 형태로 바꿉니다.
export const toProduct = (stock: StockItem): Product => ({
  id: stock.stockId,
  name: stock.name,
  category: stock.sectorName,
  price: stock.currentPrice,
  changeRate: stock.changeRate,
  logoImageUrl: stock.logoImageUrl,
  isFavorite: stock.isWishlisted,
});
