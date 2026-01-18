export function nextIndex(current, length) {
  if (length <= 0) return 0;
  return Math.min(current + 1, length - 1);
}

export function prevIndex(current, length) {
  if (length <= 0) return 0;
  return Math.max(current - 1, 0);
}
