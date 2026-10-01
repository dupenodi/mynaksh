import type { ImageSourcePropType } from 'react-native';

import type { ImageSetId } from '../media/imageSets';

export type ExperienceGroupId = 'readings' | 'rituals' | 'products' | 'timing' | 'learn' | 'offers';

export type ExperienceGroup = {
  id: ExperienceGroupId;
  label: string;
  /** Told to the live model so it knows what the group is for. */
  purpose: string;
};

/** How a card looks. Every type has one, including unknown types (via the fallback). */
export type ExperienceLook = {
  label: string;
  glyph: string;
  tint: string;
  wash: string;
  cta: string;
  blurb: string;
  image?: ImageSourcePropType;
};

/** One entry in a group file: the look plus what the model needs to know to suggest it. */
export type ExperienceSpec = ExperienceLook & {
  /** When to suggest it. */
  hint: string;
  /** Extra JSON fields the model should fill for this type, described for the prompt. */
  fields?: string;
  /** The model picks the card's image from this set by key. */
  imageSet?: ImageSetId;
  /** Tapping the call to action sends this to the astrologer instead of confirming, so the chat moves on. */
  ask?: string;
};

export type Experience = ExperienceSpec & {
  type: string;
  group: ExperienceGroupId;
};
