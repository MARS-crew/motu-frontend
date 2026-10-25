export type NewListing = {
  id: number;
  name: string;
  description: string;
  listedAt: string;
  price: number;
  changeRate: number;
  // 로고가 없으면 color 배경에 이름 첫 글자를 표시합니다.
  logoImageUrl?: string | null;
  color?: string;
  // 상장 후 7일 이내 여부입니다. 서버에서 계산된 값을 받습니다
  isNew: boolean;
  isFavorite: boolean;
};
