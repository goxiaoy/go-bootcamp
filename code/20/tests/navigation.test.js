import test from 'node:test';
import assert from 'node:assert/strict';
import { nextIndex, prevIndex } from '../app/js/navigation.js';

test('nextIndex advances until end', () => {
  assert.equal(nextIndex(0, 3), 1);
  assert.equal(nextIndex(1, 3), 2);
  assert.equal(nextIndex(2, 3), 2);
});

test('prevIndex goes back until start', () => {
  assert.equal(prevIndex(2, 3), 1);
  assert.equal(prevIndex(1, 3), 0);
  assert.equal(prevIndex(0, 3), 0);
});
