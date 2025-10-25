export function formatTimeAgo(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [60, 's'],
    [60, 'm'],
    [24, 'h'],
    [7, 'd'],
    [4.34524, 'w'],
    [12, 'mo'],
  ];

  let unit = 'y';
  let value = seconds;

  const divisors = [60, 60, 24, 7, 4.34524, 12];
  const labels = ['s', 'm', 'h', 'd', 'w', 'mo'];

  for (let i = 0; i < divisors.length && value >= divisors[i]; i += 1) {
    value = Math.floor(value / divisors[i]);
    unit = labels[i + 1] ?? 'y';
  }

  if (value <= 0) return 'now';
  if (unit === 'y' && value < 1) return 'now';
  return `${value}${unit}`;
}

export function formatNumberShort(n: number): string {
  if (n < 1000) return `${n}`;
  if (n < 1000000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}m`;
}
