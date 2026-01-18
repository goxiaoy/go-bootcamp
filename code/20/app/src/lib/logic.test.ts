import { it, expect } from 'vitest';
import { buildTodayQueue } from './logic';

it('buildTodayQueue picks review + new', () => {
  const words = [
    { id: 'w1', text: 'abandon' },
    { id: 'w2', text: 'ability' },
  ];
  const progress = { w1: { nextReview: '2026-01-18', stage: 1 } };
  const { queue, reviewIds, newIds } = buildTodayQueue({
    words,
    progress,
    dailyCount: 2,
    today: '2026-01-18',
  });

  expect(reviewIds).toEqual(['w1']);
  expect(newIds).toEqual(['w2']);
  expect(queue.length).toBe(2);
});
