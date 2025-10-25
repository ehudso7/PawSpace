const DEFAULT_SUGGESTIONS = [
  "#petgrooming",
  "#doggrooming",
  "#catgrooming",
  "#petspa",
  "#petcare",
  "#beforeandafter",
  "#transformation",
  "#pawspace",
];

export function suggestHashtags(input: string, limit = 6): string[] {
  const prefix = input.trim().toLowerCase();
  const scored = DEFAULT_SUGGESTIONS.map((tag) => ({
    tag,
    score: scoreTag(tag, prefix),
  }))
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((t) => t.tag);

  const fallback = DEFAULT_SUGGESTIONS.slice(0, limit);
  return scored.length > 0 ? scored : fallback;
}

function scoreTag(tag: string, prefix: string): number {
  if (!prefix) return 1;
  const normalized = tag.toLowerCase();
  if (normalized.startsWith(prefix)) return 3;
  if (normalized.includes(prefix)) return 2;
  return 0;
}
