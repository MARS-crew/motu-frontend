import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { test } from 'node:test';

const stubs = {
  '@/constants/env': 'export const API_URL="https://api.example.test/api";',
  '@/utils/tokenStorage':
    'export const tokenStorage={getAccessToken:async()=>null,clear:async()=>{}};',
  '@/stores/useAuthStore': 'export const useAuthStore={getState:()=>({setLoggedIn:()=>{}})};',
};
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (stubs[specifier])
      return {
        url: `data:text/javascript,${encodeURIComponent(stubs[specifier])}`,
        shortCircuit: true,
      };
    if (specifier.startsWith('@/'))
      return nextResolve(new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href, context);
    return nextResolve(specifier, context);
  },
});
const { api } = await import('../src/apis/instance.ts');
const { postPointGrant } = await import('../src/apis/point.ts');
const { getPointResetStatus, postPointReset } = await import('../src/apis/pointReset.ts');
const grant = {
  amount: 100000,
  cashBefore: 200000,
  cashAfter: 300000,
  grantedAt: '2026-10-26T01:00:00Z',
  nextAvailableAt: '2026-10-27T01:00:00Z',
};
const reset = {
  cashBefore: 200000,
  cashAfter: 3000000,
  resetAt: '2026-10-26T01:00:00Z',
  nextAvailableAt: '2026-11-02T01:00:00Z',
};
const resetStatus = {
  cash: 200000,
  resetCash: 3000000,
  available: true,
  reason: null,
  conditions: [],
  nextAvailableAt: null,
  remainingSeconds: 0,
};
let requests = [];
api.defaults.adapter = async (config) => {
  requests.push({ method: config.method, url: config.url, data: config.data });
  const data =
    config.method === 'get' ? resetStatus : config.url.endsWith('point-grant') ? grant : reset;
  return { config, status: 200, statusText: 'OK', headers: {}, data: { success: true, data } };
};

test('지급 신청은 본문 없이 POST하고 서버 결과를 반환한다', async () => {
  requests = [];
  assert.deepEqual(await postPointGrant(), grant);
  assert.equal(
    api.getUri({ url: requests[0].url }),
    'https://api.example.test/api/accounts/me/point-grant',
  );
  assert.deepEqual(requests, [
    { method: 'post', url: '/accounts/me/point-grant', data: undefined },
  ]);
});

test('리셋 상태 GET과 신청 POST를 구분하고 결과를 반환한다', async () => {
  requests = [];
  assert.deepEqual(await getPointResetStatus(), resetStatus);
  assert.deepEqual(await postPointReset(), reset);
  assert.deepEqual(
    requests.map(({ method, url }) => ({ method, url })),
    [
      { method: 'get', url: '/accounts/me/point-reset' },
      { method: 'post', url: '/accounts/me/point-reset' },
    ],
  );
});

test('실패한 POST를 자동으로 재전송하거나 성공 결과로 바꾸지 않는다', async () => {
  let count = 0;
  api.defaults.adapter = async () => {
    count++;
    throw new Error('Connection lost');
  };
  await assert.rejects(postPointGrant, /Connection lost/);
  assert.equal(count, 1);
  await assert.rejects(postPointReset, /Connection lost/);
  assert.equal(count, 2);
});
