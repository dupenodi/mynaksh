export const KNOWN_RECOMMENDATION_TYPES = [
  'gemstone',
  'tarot',
  'consultation',
  'article',
  'promotion',
  'remedy',
  'panchang',
] as const;

export type KnownRecommendationType = (typeof KNOWN_RECOMMENDATION_TYPES)[number];

export type Recommendation = {
  id: string;
  type: KnownRecommendationType | (string & {});
  title: string;
  subtitle?: string;
};
