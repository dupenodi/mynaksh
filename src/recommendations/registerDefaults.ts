import { KNOWN_RECOMMENDATION_TYPES } from '../domain/recommendation';
import { RecommendationCard } from './RecommendationCard';
import { registerRecommendation } from './registry';

let didRegister = false;

export function registerDefaultRecommendations(): void {
  if (didRegister) {
    return;
  }

  didRegister = true;

  for (const type of KNOWN_RECOMMENDATION_TYPES) {
    registerRecommendation(type, RecommendationCard);
  }
}
