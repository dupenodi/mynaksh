import type { ReactElement } from 'react';

import {
  FallbackCard,
  type RecommendationCardProps,
} from './RecommendationCard';

export type RecommendationCardComponent = (
  props: RecommendationCardProps,
) => ReactElement;

const cards = new Map<string, RecommendationCardComponent>();

export function registerRecommendation(
  type: string,
  component: RecommendationCardComponent,
): void {
  cards.set(type, component);
}

/** Unknown future types render through the fallback and do not throw. */
export function resolveRecommendationCard(type: string): RecommendationCardComponent {
  return cards.get(type) ?? FallbackCard;
}
