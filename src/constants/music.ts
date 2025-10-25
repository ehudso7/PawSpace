export interface MusicDef {
  id: string;
  name: string;
  uri: string;
  duration: number;
}

export const MUSIC_CLIPS: MusicDef[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `track-${i + 1}`,
  name: `Track ${i + 1}`,
  // Royalty-free short clip placeholder (replace in production)
  uri: `https://cdn.pixabay.com/download/audio/2022/03/15/audio_2d8b4d7b0c.mp3?filename=cute-kittens-12345.mp3`,
  duration: 12,
}));
