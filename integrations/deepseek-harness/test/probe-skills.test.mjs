import assert from 'node:assert/strict';
import test from 'node:test';
import { waitForHakaisatsu } from './probe-skills.mjs';

test('skill probe waits for a provider that registers during DSH boot', async () => {
  let calls = 0;
  const hakaisatsu = { name: 'hakaisatsu', provider: 'hakaisatsu-plugin' };
  const skills = {
    async list() {
      calls += 1;
      return calls < 3 ? [] : [hakaisatsu];
    },
  };
  const result = await waitForHakaisatsu(skills, '/workspace', {
    timeoutMs: 1_000,
    sleep: async () => {},
  });
  assert.equal(calls, 3);
  assert.equal(result.hakaisatsu, hakaisatsu);
  assert.deepEqual(result.list, [hakaisatsu]);
});
