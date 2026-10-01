import { ScrollView, StyleSheet } from 'react-native';

import { SCREEN_GUTTER } from '../components/layout';
import type { Recommendation } from '../domain/recommendation';
import { CARD_GAP, CARD_WIDTH } from './RecommendationCard';
import { resolveRecommendationCard } from './registry';

type Props = {
  recommendations: Recommendation[];
  onPress: (recommendation: Recommendation) => void;
};

/** A horizontal rail that snaps one card at a time. Each card comes from the registry by type. */
export function RecommendationRail({ recommendations, onPress }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.rail}
      contentContainerStyle={styles.content}
      decelerationRate="fast"
      snapToInterval={CARD_WIDTH + CARD_GAP}
      snapToAlignment="start"
    >
      {recommendations.map((recommendation) => {
        const Card = resolveRecommendationCard(recommendation.type);
        return <Card key={recommendation.id} recommendation={recommendation} onPress={onPress} />;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Negative margin lets the rail reach the screen edges; padding lines the first card up with the text.
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
});
