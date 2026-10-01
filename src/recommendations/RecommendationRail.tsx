import { StyleSheet } from 'react-native';

import { HScroll } from '../components/HScroll';
import { SCREEN_GUTTER } from '../components/layout';
import type { Recommendation } from '../domain/recommendation';
import { getExperience } from './catalog';
import { resolveRecommendationCard } from './registry';

type Props = {
  recommendations: Recommendation[];
  onPress: (recommendation: Recommendation) => void;
};

/** Horizontal rail. The registry picks the renderer so unknown types stay on it. */
export function RecommendationRail({ recommendations, onPress }: Props) {
  return (
    <HScroll style={styles.rail} contentContainerStyle={styles.content}>
      {recommendations.map((recommendation) => {
        const Card = resolveRecommendationCard(recommendation.type);
        const look = getExperience(recommendation.type);
        return (
          <HScroll.Item
            key={recommendation.id}
            onPress={() => onPress(recommendation)}
            accessibilityLabel={`${look.label}: ${recommendation.title}`}
            pressedStyle={styles.pressed}
          >
            <Card recommendation={recommendation} />
          </HScroll.Item>
        );
      })}
    </HScroll>
  );
}

const styles = StyleSheet.create({
  // Negative margin reaches the screen edges; padding lines the first card up with the text.
  rail: {
    marginTop: 14,
    marginHorizontal: -SCREEN_GUTTER,
  },
  content: {
    paddingLeft: SCREEN_GUTTER,
    paddingRight: SCREEN_GUTTER - 12,
    paddingTop: 2,
    paddingBottom: 6,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});
