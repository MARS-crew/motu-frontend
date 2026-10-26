import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { test } from 'node:test';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/'))
      return nextResolve(new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href, context);
    return nextResolve(specifier, context);
  },
});

const { pointResetStatusSchema, pointResetResultSchema } =
  await import('../src/schemas/pointResetSchema.ts');
const { getPointResetStatusReason, getPointResetRequestErrorMessage } =
  await import('../src/utils/pointReset.ts');
const { AxiosError } = await import('axios');
const status = {
  resetCash: 3000000,
  cash: 200000,
  available: false,
  reason: '보유 포인트가 리셋 가능 기준(300,000P) 이상입니다.',
  conditions: [{ condition: 'CASH_BELOW_LIMIT', met: false }],
  nextAvailableAt: null,
  remainingSeconds: 0,
};

test('리셋 가능 여부 응답의 조건과 서버 사유를 표시한다', () => {
  const parsed = pointResetStatusSchema.parse(status);
  assert.equal(getPointResetStatusReason(parsed), status.reason);
  assert.equal(
    getPointResetStatusReason({
      ...parsed,
      available: true,
      conditions: [{ condition: 'CASH_BELOW_LIMIT', met: true }],
    }),
    null,
  );
});

test('available만 참이어도 충족하지 못한 조건이 있으면 리셋을 허용하지 않는다', () => {
  assert.equal(
    getPointResetStatusReason({ ...status, available: true, reason: null }),
    '현재 포인트 리셋 조건을 충족하지 않습니다.',
  );
  assert.equal(
    getPointResetStatusReason({
      ...status,
      reason: null,
      conditions: [{ condition: 'NO_HOLDINGS', met: false, message: '보유 상품이 존재합니다.' }],
    }),
    '보유 상품이 존재합니다.',
  );
});

test('잘못된 리셋 응답은 성공 데이터로 사용하지 않는다', () => {
  for (const patch of [
    { available: 'true' },
    { resetCash: -1 },
    { cash: -1 },
    { remainingSeconds: -1 },
    { conditions: [{ condition: 'UNKNOWN', met: 'true' }] },
  ])
    assert.equal(pointResetStatusSchema.safeParse({ ...status, ...patch }).success, false);
});

test('리셋 성공 결과의 실제 잔액과 다음 가능 시간을 읽는다', () => {
  const result = {
    cashBefore: 200000,
    cashAfter: 3000000,
    resetAt: '2026-10-20T10:19:00.000Z',
    nextAvailableAt: '2026-10-27T10:19:00.000Z',
  };
  assert.deepEqual(pointResetResultSchema.parse(result), result);
  assert.equal(pointResetResultSchema.safeParse({ ...result, resetAt: 'invalid' }).success, false);
});

test('리셋 실패 응답 details.conditions의 미충족 사유를 읽는다', () => {
  const error = new AxiosError('Conflict', 'ERR_BAD_REQUEST', undefined, undefined, {
    status: 409,
    data: {
      success: false,
      error: {
        code: 'POINT_RESET_NOT_ALLOWED',
        message: '리셋 불가',
        details: {
          conditions: [
            { condition: 'NO_OPEN_ORDERS', met: false, message: '미체결 주문이 존재합니다.' },
          ],
        },
      },
    },
  });
  assert.equal(getPointResetRequestErrorMessage(error), '미체결 주문이 존재합니다.');
});
