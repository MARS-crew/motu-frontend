import { isAxiosError } from 'axios';

export function getPointGrantRemainingSeconds(
  status: { remainingSeconds: number },
  receivedAt: number,
  now: number,
) {
  const elapsedSeconds = Math.floor(Math.max(0, now - receivedAt) / 1000);
  return Math.max(0, status.remainingSeconds - elapsedSeconds);
}

export function formatPointGrantRemainingTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return [
    hours > 0 ? `${hours}시간` : '',
    minutes > 0 ? `${minutes}분` : '',
    `${remainingSeconds}초`,
  ]
    .filter(Boolean)
    .join(' ');
}

export function formatPointRemainingHoursMinutes(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${String(hours).padStart(2, '0')}시간 ${String(minutes).padStart(2, '0')}분`;
}

export function formatPointGrantDate(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function getPointGrantErrorMessage(error: unknown) {
  if (isAxiosError<unknown>(error)) {
    if (error.response?.status === 401) return '로그인 후 포인트 지급 정보를 확인해 주세요.';
    const body = error.response?.data;
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500 &&
      body &&
      typeof body === 'object' &&
      'message' in body &&
      typeof body.message === 'string' &&
      body.message.trim()
    )
      return body.message;
  }
  return '포인트 지급 정보를 불러오지 못했습니다. 다시 시도해 주세요.';
}
