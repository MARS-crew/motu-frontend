import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AxiosError } from 'axios';

import { pointGrantStatusSchema } from '../src/schemas/pointGrantSchema.ts';
import {
  formatPointGrantDate,
  formatPointGrantRemainingTime,
  getPointGrantErrorMessage,
  getPointGrantRemainingSeconds,
} from '../src/utils/pointGrant.ts';

const waitingStatus = {
  cash: 2345678,
  amount: 100000,
  available: false,
  nextAvailableAt: '2026-10-21T10:19:00.000Z',
  remainingSeconds: 12280,
  lastGrantedAt: '2026-10-20T10:19:00.000Z',
};

test('Swagger 응답과 첫 지급 가능한 null 날짜 응답을 읽는다', () => {
  assert.equal(pointGrantStatusSchema.parse(waitingStatus).cash, 2345678);
  assert.equal(
    pointGrantStatusSchema.parse({
      ...waitingStatus,
      available: true,
      remainingSeconds: 0,
      nextAvailableAt: null,
      lastGrantedAt: null,
    }).available,
    true,
  );
});

test('잘못된 서버 응답은 지급 가능 상태로 사용하지 않는다', () => {
  for (const patch of [
    { available: 'true' },
    { remainingSeconds: -1 },
    { cash: '2345678' },
    { amount: 0 },
    { nextAvailableAt: 'not-a-date' },
  ]) {
    assert.equal(pointGrantStatusSchema.safeParse({ ...waitingStatus, ...patch }).success, false);
  }
});

test('서버의 남은 시간을 수신 시점부터 초 단위로 줄인다', () => {
  assert.equal(getPointGrantRemainingSeconds(waitingStatus, 1000, 1999), 12280);
  assert.equal(getPointGrantRemainingSeconds(waitingStatus, 1000, 2000), 12279);
  assert.equal(getPointGrantRemainingSeconds(waitingStatus, 1000, 3601000), 8680);
});

test('앱을 오래 닫았거나 기기 시각이 달라져도 남은 시간이 음수이거나 증가하지 않는다', () => {
  assert.equal(getPointGrantRemainingSeconds(waitingStatus, 1000, 99999999), 0);
  assert.equal(getPointGrantRemainingSeconds(waitingStatus, 1000, 0), 12280);
});

test('남은 시간을 시간·분·초로 표시한다', () => {
  assert.equal(formatPointGrantRemainingTime(12280), '3시간 24분 40초');
  assert.equal(formatPointGrantRemainingTime(61), '1분 1초');
  assert.equal(formatPointGrantRemainingTime(1), '1초');
  assert.equal(formatPointGrantRemainingTime(0), '0초');
});

test('서버의 ISO 날짜를 기기 현지 시각으로 표시한다', () => {
  const value = '2026-10-21T10:19:00.000Z';
  const date = new Date(value);
  const actual = formatPointGrantDate(value);
  assert.match(actual, /^2026\.10\.21 \d{2}:19$/);
  assert.ok(actual.endsWith(`${String(date.getHours()).padStart(2, '0')}:19`));
});

function apiError(status, body) {
  return new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    data: body,
  });
}

test('대기 시간 외 서버의 지급 불가 메시지를 표시한다', () => {
  assert.equal(
    getPointGrantErrorMessage(apiError(403, { message: '이용이 제한된 계정입니다.' })),
    '이용이 제한된 계정입니다.',
  );
});

test('인증 만료·연결 오류·잘못된 오류 응답을 구분해 안내한다', () => {
  assert.equal(
    getPointGrantErrorMessage(apiError(401, { message: 'Unauthorized' })),
    '로그인 후 포인트 지급 정보를 확인해 주세요.',
  );
  const fallback = '포인트 지급 정보를 불러오지 못했습니다. 다시 시도해 주세요.';
  assert.equal(getPointGrantErrorMessage(apiError(400, { message: { invalid: true } })), fallback);
  assert.equal(
    getPointGrantErrorMessage(apiError(500, { message: 'Internal server error' })),
    fallback,
  );
  assert.equal(getPointGrantErrorMessage(new Error('Network error')), fallback);
});

test('추가 지급 결과는 서버가 반환한 금액과 지급 시각을 그대로 사용한다', async () => {
  const { pointGrantResultSchema } = await import('../src/schemas/pointGrantSchema.ts');
  const result = {
    amount: 100000,
    cashBefore: 2345678,
    cashAfter: 2445678,
    grantedAt: '2026-10-20T10:19:00.000Z',
    nextAvailableAt: '2026-10-21T10:19:00.000Z',
  };
  assert.deepEqual(pointGrantResultSchema.parse(result), result);
  assert.equal(pointGrantResultSchema.safeParse({ ...result, cashAfter: -1 }).success, false);
  assert.equal(
    pointGrantResultSchema.safeParse({ ...result, grantedAt: 'invalid' }).success,
    false,
  );
});

test('Swagger 원본 응답과 success/data 응답을 모두 읽는다', async () => {
  const { unwrapPointResponse } = await import('../src/utils/pointResponse.ts');
  assert.deepEqual(unwrapPointResponse(waitingStatus), waitingStatus);
  assert.deepEqual(unwrapPointResponse({ success: true, data: waitingStatus }), waitingStatus);
  const failure = { success: false, error: { message: '실패' } };
  assert.deepEqual(unwrapPointResponse(failure), failure);
});

test('중첩 오류 응답의 지급 대기·동시 갱신 오류를 처리한다', async () => {
  const { getPointRequestErrorMessage } = await import('../src/utils/pointResponse.ts');
  assert.equal(
    getPointRequestErrorMessage(
      apiError(409, { success: false, error: { code: 'POINT_GRANT_TOO_SOON' } }),
      '실패',
    ),
    '포인트 지급 후 24시간이 지나지 않았습니다.',
  );
  assert.equal(
    getPointRequestErrorMessage(
      apiError(409, { error: { code: 'ACCOUNT_CONCURRENT_UPDATE' } }),
      '실패',
    ),
    '계좌 정보가 변경되었습니다. 최신 정보를 확인한 후 다시 시도해 주세요.',
  );
  assert.equal(
    getPointRequestErrorMessage(apiError(401, {}), '실패'),
    '로그인 후 다시 시도해 주세요.',
  );
  assert.equal(
    getPointRequestErrorMessage(new Error('Network'), '결과를 확인할 수 없습니다.'),
    '결과를 확인할 수 없습니다.',
  );
});
