import type { ImageSourcePropType } from 'react-native';

import type { KnownRecommendationType } from '../domain/recommendation';

export type CardAppearance = {
  label: string;
  glyph: string;
  tint: string;
  wash: string;
  cta: string;
  image?: ImageSourcePropType;
  blurb: string;
};

const appearances: Record<KnownRecommendationType, CardAppearance> = {
  gemstone: {
    label: 'Gemstone',
    glyph: '◆',
    tint: '#9DB8F0',
    wash: '#1A2340',
    cta: 'View stone',
    image: require('../../assets/images/gemstone.jpg'),
    blurb: 'Certified, ethically sourced and energised before it ships.',
  },
  tarot: {
    label: 'Tarot',
    glyph: '✦',
    tint: '#D4A9E4',
    wash: '#2A1B33',
    cta: 'Draw cards',
    image: require('../../assets/images/tarot.jpg'),
    blurb: 'A three-card spread read against your birth chart.',
  },
  consultation: {
    label: 'Consultation',
    glyph: '☾',
    tint: '#A3C4A5',
    wash: '#18261C',
    cta: 'Book a call',
    image: require('../../assets/images/consultation.jpg'),
    blurb: 'A private call with a verified Vedic astrologer.',
  },
  article: {
    label: 'Article',
    glyph: '¶',
    tint: '#E3BC86',
    wash: '#2B2116',
    cta: 'Read now',
    image: require('../../assets/images/article.jpg'),
    blurb: 'A short read from the MyNaksh library. About 6 minutes.',
  },
  promotion: {
    label: 'Offer',
    glyph: '✺',
    tint: '#D6AC5E',
    wash: '#2B2213',
    cta: 'Claim offer',
    image: require('../../assets/images/promotion.jpg'),
    blurb: 'Applied automatically at checkout.',
  },
  remedy: {
    label: 'Remedy',
    glyph: '❂',
    tint: '#AEB9EA',
    wash: '#1B2038',
    cta: 'See ritual',
    image: require('../../assets/images/remedy.jpg'),
    blurb: 'A simple ritual chosen for the planet that needs support.',
  },
  panchang: {
    label: 'Panchang',
    glyph: '◐',
    tint: '#8FD0CB',
    wash: '#132A2A',
    cta: 'View today',
    image: require('../../assets/images/panchang.jpg'),
    blurb: 'Tithi, nakshatra and auspicious hours for your city.',
  },
};

const fallback: Omit<CardAppearance, 'label'> = {
  glyph: '✧',
  tint: '#9E9AA8',
  wash: '#1C2239',
  cta: 'Open',
  blurb: 'Suggested for you by your astrologer.',
};

export function getAppearance(type: string): CardAppearance {
  if (type in appearances) {
    return appearances[type as KnownRecommendationType];
  }
  // Unknown types still get a readable label from the raw type string.
  return { ...fallback, label: type.charAt(0).toUpperCase() + type.slice(1) };
}
