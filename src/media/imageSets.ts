import type { ImageSourcePropType } from 'react-native';

import { gemImages, tarotImages } from './images';

/**
 * Named image sets the model can pick from by key. The model chooses the key
 * ("ruby", "the-star"); the app owns the artwork. A key with no art falls back
 * to the card's glyph, so the model can never break the UI.
 */
export const GEM_KEYS = [
  'ruby',
  'pearl',
  'red-coral',
  'emerald',
  'yellow-sapphire',
  'diamond',
  'blue-sapphire',
  'hessonite',
  'cats-eye',
] as const;

/** The Major Arcana by name. Image keys are derived from the names. */
export const TAROT_CARDS = [
  'The Fool',
  'The Magician',
  'The High Priestess',
  'The Empress',
  'The Emperor',
  'The Hierophant',
  'The Lovers',
  'The Chariot',
  'Strength',
  'The Hermit',
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World',
] as const;

/** The proper name for any spelling of a Major Arcana card ("the-star" → "The Star"); other names pass through. */
export function tarotName(value: string): string {
  return TAROT_CARDS.find((name) => toImageKey(name) === toImageKey(value)) ?? value;
}

export type ImageSetId = 'gems' | 'tarot';

const sets: Record<ImageSetId, { keys: readonly string[]; images: Partial<Record<string, ImageSourcePropType>> }> = {
  gems: { keys: GEM_KEYS, images: gemImages },
  tarot: { keys: TAROT_CARDS.map((name) => toImageKey(name)), images: tarotImages },
};

/** "Blue Sapphire", "blue_sapphire" and "blue-sapphire" all find the same art. */
export function toImageKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function findImage(set: ImageSetId, key: string | undefined): ImageSourcePropType | undefined {
  return key ? sets[set].images[toImageKey(key)] : undefined;
}

export function imageKeys(set: ImageSetId): readonly string[] {
  return sets[set].keys;
}
