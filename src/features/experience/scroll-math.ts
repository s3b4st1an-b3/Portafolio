export function scrollProgress(start: number, end: number, value: number) {
  if (end <= start) return value >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

export function sectionAt(starts: readonly number[], readingLine: number) {
  return Math.max(
    0,
    starts.findLastIndex((start) => start <= readingLine),
  );
}
