import { KNOWN_RECOMMENDATION_TYPES } from './catalog';
import { RecommendationCard } from './RecommendationCard';
import { registerRecommendation } from './registry';

let didRegister = false;

/** Every catalog type uses the shared card. A type with its own UI registers over it afterwards. */
export function registerDefaultRecommendations(): void {
  if (didRegister) {
    return;
  }

  didRegister = true;

  for (const type of KNOWN_RECOMMENDATION_TYPES) {
    registerRecommendation(type, RecommendationCard);
  }
}
