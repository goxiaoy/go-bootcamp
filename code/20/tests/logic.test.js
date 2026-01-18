import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeDate,
  calcNextReviewDate,
  buildTodayQueue,
} from '../app/js/logic.js';

test('normalizeDate returns YYYY-MM-DD', () => {
  const value = normalizeDate(new Date('2026-01-18T10:00:00Z'));
  assert.equal(value, '2026-01-18');
});

test('calcNextReviewDate follows spacing schedule', () => {
  const base = '2026-01-18';
  assert.equal(calcNextReviewDate(base, 0), '2026-01-19');
  assert.equal(calcNextReviewDate(base, 1), '2026-01-21');
  assert.equal(calcNextReviewDate(base, 2), '2026-01-25');
});

test('buildTodayQueue picks new and review words', () => {
  const words = [
    { id: 'w1', text: 'abandon' },
    { id: 'w2', text: 'ability' },
    { id: 'w3', text: 'abroad' },
  ];
  const progress = {
    w1: { nextReview: '2026-01-18', stage: 1 },
  };
  const { queue, newIds, reviewIds } = buildTodayQueue({
    words,
    progress,
    dailyCount: 2,
    today: '2026-01-18',
  });
  assert.deepEqual(reviewIds, ['w1']);
  assert.deepEqual(newIds, ['w2']);
  assert.equal(queue.length, 2);
});
