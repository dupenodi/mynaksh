import { Star } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import type { Review } from '../../domain/personas';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

const STAR_COUNT = 5;

export function ReviewItem({ review, last }: { review: Review; last: boolean }) {
  return (
    <View style={[styles.review, !last && styles.divider]}>
      <View style={styles.reviewTop}>
        <Text style={styles.reviewAuthor}>{review.author}</Text>
        <View style={styles.reviewStars} accessibilityLabel={`${review.rating} out of 5`}>
          {Array.from({ length: STAR_COUNT }, (_, i) => (
            <Star
              key={i}
              size={11}
              color={i < review.rating ? colors.text : colors.lineStrong}
              fill={i < review.rating ? colors.text : 'transparent'}
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>{review.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  review: {
    paddingVertical: 14,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewAuthor: {
    flexShrink: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
    marginLeft: 8,
  },
  reviewText: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
  },
});
