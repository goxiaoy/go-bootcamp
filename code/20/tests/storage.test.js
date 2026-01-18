import test from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryStore } from '../app/js/storage.js';

test('memory store set/get works', () => {
  const store = createMemoryStore();
  store.set('dailyCount', 30);
  assert.equal(store.get('dailyCount'), 30);
});
