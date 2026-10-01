import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Kundli } from '../../domain/kundli';
import type { DislikeReason, Feedback, Message } from '../../domain/message';
import type { Persona } from '../../domain/personas';
import type { Recommendation } from '../../domain/recommendation';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { AdvisorMessage } from './AdvisorMessage';
import { UserBubble } from './UserBubble';

export type MessageActions = {
  onLongPress: (message: Message) => void;
  onRecommendationPress: (recommendation: Recommendation) => void;
  onRate: (id: string, rating: Feedback['rating']) => void;
  onToggleReason: (id: string, reason: DislikeReason) => void;
  onRetry: (id: string) => void;
  onQuickReply: (text: string) => void;
  onSubmitKundli: (kundli: Kundli) => void;
  onEditKundli: () => void;
};

export type MessageRowProps = MessageActions & {
  message: Message;
  startsGroup: boolean;
  endsGroup: boolean;
  isLatest: boolean;
  persona: Persona;
  kundli: Kundli | null;
  savedKundli: Kundli | null;
};

// memo: a row re-renders only when its own props change, not on every new message.
export const MessageRow = memo(function MessageRow(props: MessageRowProps) {
  const { message } = props;

  switch (message.type) {
    case 'system':
      return <SystemNote text={message.text} />;
    case 'user':
      return <UserBubble {...props} message={message} />;
    case 'ai':
    case 'human':
      return <AdvisorMessage {...props} message={message} />;
  }
});

export function DaySeparator({ label }: { label: string }) {
  return (
    <View style={styles.dayRow} accessibilityRole="header">
      <Text style={styles.dayText}>{label}</Text>
    </View>
  );
}

function SystemNote({ text }: { text: string }) {
  return (
    <View style={styles.systemRow}>
      <View style={styles.rule} />
      <Text style={styles.systemText}>{text}</Text>
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  dayRow: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  dayText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.2,
    color: colors.faint,
  },
  systemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  systemText: {
    marginHorizontal: 12,
    fontFamily: fonts.displayItalic,
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    flexShrink: 1,
  },
});
