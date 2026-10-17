import type { Product } from '@/types/product';

// 퍼블리싱 확인용 데이터입니다. 서버 연동 시 Query로 대체합니다
// 관심 상품이 없는 화면은 빈 배열로 바꿔서 확인합니다.
export const FAVORITE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: '삼성전자',
    category: '반도체',
    price: 71200,
    changeRate: 1.84,
    color: '#1428A0',
    isFavorite: true,
  },
  {
    id: 4,
    name: 'NAVER',
    category: '인터넷',
    price: 187500,
    changeRate: 2.74,
    color: '#03C75A',
    isFavorite: true,
  },
  {
    id: 3,
    name: '카카오',
    category: '인터넷',
    price: 41300,
    changeRate: -1.42,
    color: '#391B1B',
    isFavorite: true,
  },
  {
    id: 9,
    name: '대한전선',
    category: '산업재',
    price: 4120,
    changeRate: 2.11,
    color: '#1E3A5F',
    isFavorite: true,
  },
];
