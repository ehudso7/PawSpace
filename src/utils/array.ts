export function upsertById<T extends { id: string }>(items: T[], item: T): T[] {
  const index = items.findIndex(i => i.id === item.id);
  if (index === -1) return [item, ...items];
  const copy = items.slice();
  copy[index] = item;
  return copy;
}

export function removeById<T extends { id: string }>(items: T[], id: string): T[] {
  return items.filter(i => i.id !== id);
}
