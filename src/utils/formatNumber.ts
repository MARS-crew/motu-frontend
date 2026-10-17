export const formatPoint = (value: number) => `${value.toLocaleString('ko-KR')} P`;

export const formatSignedPoint = (value: number) => `${value > 0 ? '+' : ''}${formatPoint(value)}`;

export const formatRate = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

// 상승은 빨강, 하락은 파랑으로 표시합니다.
export const getChangeColorClass = (value: number) => {
  if (value > 0) return 'text-motu-red';
  if (value < 0) return 'text-motu-blue';
  return 'text-motu-black';
};
