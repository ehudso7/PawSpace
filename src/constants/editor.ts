import { Font, ColorPreset, StickerCategory, AudioTrack, FrameStyle, TransitionType } from '../types/transformation';

export const FONTS: Font[] = [
  { id: 'roboto', name: 'Roboto', family: 'Roboto-Regular' },
  { id: 'roboto-bold', name: 'Roboto Bold', family: 'Roboto-Bold' },
  { id: 'playfair', name: 'Playfair', family: 'PlayfairDisplay-Regular' },
  { id: 'dancing', name: 'Dancing Script', family: 'DancingScript-Regular' },
  { id: 'montserrat', name: 'Montserrat', family: 'Montserrat-Regular' },
];

export const COLOR_PRESETS: ColorPreset[] = [
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'black', name: 'Black', hex: '#000000' },
  { id: 'red', name: 'Red', hex: '#FF4444' },
  { id: 'blue', name: 'Blue', hex: '#4A90E2' },
  { id: 'green', name: 'Green', hex: '#7ED321' },
  { id: 'yellow', name: 'Yellow', hex: '#F5A623' },
  { id: 'purple', name: 'Purple', hex: '#9013FE' },
  { id: 'pink', name: 'Pink', hex: '#FF69B4' },
  { id: 'orange', name: 'Orange', hex: '#FF8C00' },
  { id: 'gray', name: 'Gray', hex: '#9B9B9B' },
];

export const STICKER_CATEGORIES: StickerCategory[] = [
  {
    id: 'paws',
    name: 'Paws',
    stickers: [
      { id: 'paw1', uri: 'stickers/paw1.png', name: 'Paw Print', category: 'paws' },
      { id: 'paw2', uri: 'stickers/paw2.png', name: 'Double Paws', category: 'paws' },
      { id: 'paw3', uri: 'stickers/paw3.png', name: 'Paw Trail', category: 'paws' },
      { id: 'paw4', uri: 'stickers/paw4.png', name: 'Heart Paw', category: 'paws' },
    ],
  },
  {
    id: 'hearts',
    name: 'Hearts',
    stickers: [
      { id: 'heart1', uri: 'stickers/heart1.png', name: 'Red Heart', category: 'hearts' },
      { id: 'heart2', uri: 'stickers/heart2.png', name: 'Pink Heart', category: 'hearts' },
      { id: 'heart3', uri: 'stickers/heart3.png', name: 'Hearts Trail', category: 'hearts' },
      { id: 'heart4', uri: 'stickers/heart4.png', name: 'Sparkle Heart', category: 'hearts' },
    ],
  },
  {
    id: 'stars',
    name: 'Stars',
    stickers: [
      { id: 'star1', uri: 'stickers/star1.png', name: 'Gold Star', category: 'stars' },
      { id: 'star2', uri: 'stickers/star2.png', name: 'Sparkle', category: 'stars' },
      { id: 'star3', uri: 'stickers/star3.png', name: 'Star Burst', category: 'stars' },
      { id: 'star4', uri: 'stickers/star4.png', name: 'Shooting Star', category: 'stars' },
    ],
  },
  {
    id: 'pets',
    name: 'Pets',
    stickers: [
      { id: 'dog1', uri: 'stickers/dog1.png', name: 'Happy Dog', category: 'pets' },
      { id: 'cat1', uri: 'stickers/cat1.png', name: 'Cute Cat', category: 'pets' },
      { id: 'bone1', uri: 'stickers/bone1.png', name: 'Dog Bone', category: 'pets' },
      { id: 'ball1', uri: 'stickers/ball1.png', name: 'Tennis Ball', category: 'pets' },
    ],
  },
  {
    id: 'text',
    name: 'Text',
    stickers: [
      { id: 'wow', uri: 'stickers/wow.png', name: 'WOW!', category: 'text' },
      { id: 'amazing', uri: 'stickers/amazing.png', name: 'Amazing', category: 'text' },
      { id: 'before', uri: 'stickers/before.png', name: 'Before', category: 'text' },
      { id: 'after', uri: 'stickers/after.png', name: 'After', category: 'text' },
    ],
  },
];

export const AUDIO_TRACKS: AudioTrack[] = [
  { id: 'upbeat1', name: 'Upbeat Pop', uri: 'audio/upbeat1.mp3', duration: 15 },
  { id: 'gentle1', name: 'Gentle Melody', uri: 'audio/gentle1.mp3', duration: 12 },
  { id: 'happy1', name: 'Happy Tune', uri: 'audio/happy1.mp3', duration: 14 },
  { id: 'calm1', name: 'Calm Vibes', uri: 'audio/calm1.mp3', duration: 16 },
  { id: 'energetic1', name: 'Energetic Beat', uri: 'audio/energetic1.mp3', duration: 13 },
  { id: 'sweet1', name: 'Sweet Dreams', uri: 'audio/sweet1.mp3', duration: 15 },
  { id: 'playful1', name: 'Playful Pup', uri: 'audio/playful1.mp3', duration: 11 },
  { id: 'peaceful1', name: 'Peaceful Moment', uri: 'audio/peaceful1.mp3', duration: 18 },
  { id: 'joyful1', name: 'Joyful Day', uri: 'audio/joyful1.mp3', duration: 12 },
  { id: 'cozy1', name: 'Cozy Time', uri: 'audio/cozy1.mp3', duration: 14 },
  { id: 'bright1', name: 'Bright Morning', uri: 'audio/bright1.mp3', duration: 13 },
  { id: 'warm1', name: 'Warm Hug', uri: 'audio/warm1.mp3', duration: 16 },
  { id: 'fresh1', name: 'Fresh Start', uri: 'audio/fresh1.mp3', duration: 15 },
  { id: 'magical1', name: 'Magical Moment', uri: 'audio/magical1.mp3', duration: 17 },
  { id: 'loving1', name: 'Loving Care', uri: 'audio/loving1.mp3', duration: 14 },
];

export const FRAME_STYLES: FrameStyle[] = [
  {
    id: 'none',
    name: 'None',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  {
    id: 'classic',
    name: 'Classic',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  {
    id: 'modern',
    name: 'Modern',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  {
    id: 'bold',
    name: 'Bold',
    borderWidth: 6,
    borderColor: '#000000',
  },
  {
    id: 'colorful',
    name: 'Colorful',
    borderWidth: 5,
    borderColor: '#FF6B6B',
    borderRadius: 12,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    borderWidth: 3,
    borderColor: '#D4AF37',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
];

export const TRANSITION_TYPES: { type: TransitionType; name: string; description: string }[] = [
  { type: 'fade', name: 'Fade', description: 'Smooth fade transition' },
  { type: 'slide', name: 'Slide', description: 'Slide from left to right' },
  { type: 'swipe', name: 'Swipe', description: 'Interactive swipe reveal' },
  { type: 'split', name: 'Split', description: 'Split screen comparison' },
];

export const IMAGE_CONSTRAINTS = {
  MIN_SIZE: 800,
  MAX_SIZE: 4096,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
};

export const CANVAS_SIZE = {
  width: 400,
  height: 400,
};