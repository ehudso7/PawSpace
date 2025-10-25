export interface StickerDef {
  id: string;
  name: string;
  uri: string;
}

// Using remote PNGs (placeholders). Replace with your CDN in production.
export const STICKERS: StickerDef[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `sticker-${i + 1}`,
  name: `Sticker ${i + 1}`,
  uri: `https://raw.githubusercontent.com/encharm/Font-Awesome-SVG-PNG/master/black/png/64/paw.png`,
}));
