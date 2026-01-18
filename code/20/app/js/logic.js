const REVIEW_SPACING = [1, 3, 7, 14, 30];

export function normalizeDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calcNextReviewDate(baseDate, stage) {
  const offset = REVIEW_SPACING[Math.min(stage, REVIEW_SPACING.length - 1)];
  const base = new Date(`${baseDate}T00:00:00Z`);
  base.setUTCDate(base.getUTCDate() + offset);
  return normalizeDate(base);
}

export function buildTodayQueue({ words, progress, dailyCount, today }) {
  const reviewIds = words
    .filter((word) => progress[word.id]?.nextReview <= today)
    .map((word) => word.id);

  const newIds = words
    .filter((word) => !progress[word.id])
    .map((word) => word.id)
    .slice(0, Math.max(dailyCount - reviewIds.length, 0));

  const queue = [...reviewIds, ...newIds].map((id) =>
    words.find((word) => word.id === id)
  );

  return { queue, newIds, reviewIds };
}
