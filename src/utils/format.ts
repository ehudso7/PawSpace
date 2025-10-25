export function pluralize(count: number, singular: string, plural?: string) {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural ?? `${singular}s`}`;
}

export function abbreviateCount(count: number): string {
  if (count < 1000) return `${count}`;
  const units = ['K', 'M', 'B', 'T'];
  let unitIndex = -1;
  let value = count;
  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }
  return `${value.toFixed(value >= 10 || value % 1 === 0 ? 0 : 1)}${units[unitIndex]}`;
}
