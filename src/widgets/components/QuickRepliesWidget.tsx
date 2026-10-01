import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Chip } from '../../components/Chip';
import type { WidgetProps } from '../types';

export function QuickRepliesWidget({ widget, context }: WidgetProps<'quick_replies'>) {
  if (!context.isLatest) {
    return null;
  }
  return (
    <Animated.View entering={FadeIn.delay(150)} style={styles.replies}>
      {widget.options.map((option) => (
        <Chip key={option} label={option} tone="suggestion" onPress={() => context.onQuickReply(option)} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  replies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    marginBottom: 6,
  },
});
