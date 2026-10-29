// 서버 날짜(ISO 문자열)를 기기 시간대 기준 'YYYY.MM.DD'로 표시합니다.
export const formatDotDate = (value: string) => {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}.${month}.${day}`;
};

// 서버 날짜(ISO 문자열)를 기기 시간대 기준 'YYYY/MM/DD HH:mm'으로 표시합니다.
export const formatSlashDateTime = (value: string) => {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}`;
};
