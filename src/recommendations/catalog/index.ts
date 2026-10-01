import type { ImageSourcePropType } from 'react-native';

import type { Recommendation } from '../../domain/recommendation';
import { findImage } from '../../media/imageSets';
import { EXPERIENCE_GROUPS } from '../groups';
import type { Experience, ExperienceGroup, ExperienceLook, ExperienceSpec } from '../types';
import { learn } from './learn';
import { offers } from './offers';
import { products } from './products';
import { readings } from './readings';
import { rituals } from './rituals';
import { timing } from './timing';

/**
 * Every experience an astrologer can suggest, one file per group.
 * To add a type, add an entry to its group file. The card, the detail sheet
 * and the live prompt all read from here.
 */
const catalog = { ...readings, ...rituals, ...products, ...timing, ...learn, ...offers };

export type KnownRecommendationType = keyof typeof catalog;

export const KNOWN_RECOMMENDATION_TYPES = Object.keys(catalog) as KnownRecommendationType[];

const fallback: Omit<ExperienceLook, 'label'> = {
  glyph: '✧',
  tint: '#6B6B6B',
  wash: '#F2F2F0',
  cta: 'Open',
  blurb: 'Suggested for you by your astrologer.',
};

export type ResolvedExperience = ExperienceLook &
  Pick<ExperienceSpec, 'ask' | 'imageSet'> & {
    group?: ExperienceGroup;
  };

export function isKnownType(type: string): type is KnownRecommendationType {
  return type in catalog;
}

/** Unknown types still get a readable label from the raw type string. */
export function getExperience(type: string): ResolvedExperience {
  if (isKnownType(type)) {
    const experience = catalog[type];
    return { ...experience, group: EXPERIENCE_GROUPS[experience.group] };
  }
  return { ...fallback, label: type.charAt(0).toUpperCase() + type.slice(1) };
}

export function experiencesByGroup(): { group: ExperienceGroup; experiences: Experience[] }[] {
  const all: Experience[] = Object.values(catalog);
  return Object.values(EXPERIENCE_GROUPS).map((group) => ({
    group,
    experiences: all.filter((experience) => experience.group === group.id),
  }));
}

/** The model's pick from the type's image set ("ruby"), else the type's own art, else none (the glyph shows). */
export function cardImage(recommendation: Recommendation, look: ResolvedExperience): ImageSourcePropType | undefined {
  return (look.imageSet && findImage(look.imageSet, recommendation.image)) || look.image;
}
