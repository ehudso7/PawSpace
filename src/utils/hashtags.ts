const DEFAULT_SUGGESTIONS = [
  "#petgrooming",
  "#doggrooming",
  "#catgrooming",
  "#groomerlife",
  "#beforeafter",
  "#transformation",
  "#transformationtuesday",
  "#pawspace",
];

export function suggestHashtags(seed?: string[]): string[] {
  const base = new Set<string>(DEFAULT_SUGGESTIONS);
  if (seed) {
    seed.forEach((s) => {
      const tag = s.startsWith("#") ? s : `#${s}`;
      base.add(tag.toLowerCase());
    });
  }
  return Array.from(base);
}

export function extractHashtagsFromCaption(caption: string): string[] {
  const matches = caption.match(/#[\p{L}0-9_]+/gu) ?? [];
  return matches.map((m) => m.toLowerCase());
}