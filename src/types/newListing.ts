export type NewListing = {
  id: number;
  name: string;
  description: string;
  listedAt: string;
  price: number;
  changeRate: number;
  color: string;
  // 상장 후 7일 이내 여부입니다. 서버에서 계산된 값을 받습니다
  isNew: boolean;
  isFavorite: boolean;
};
