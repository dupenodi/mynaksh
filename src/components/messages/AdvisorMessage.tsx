import { BadgeCheck } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { humanAstrologer } from '../../domain/advisors';
import type { AiMessage, HumanMessage } from '../../domain/message';
import { RecommendationRail } from '../../recommendations/RecommendationRail';
import { timeLabel } from '../../state/timeline';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { WidgetList } from '../../widgets/registry';
import { Avatar } from '../Avatar';

import { FeedbackBar } from './FeedbackBar';
import type { MessageRowProps } from './MessageRow';
import { SwipeToReply } from './SwipeToReply';

const AVATAR_SIZE = 26;

/**
 * Advisor replies read like a page, not a bubble: a name line, then full-width text.
 * Only the human astrologer keeps a tinted panel, so a real person stays visibly different.
 */
export function AdvisorMessage(props: MessageRowProps & { message: AiMessage | HumanMessage }) {
  const {
    message,
    persona,
    startsGroup,
    endsGroup,
    selected,
    onLongPress,
    onAction,
    onRecommendationPress,
    onRate,
    onToggleReason,
  } = props;
  const isHuman = message.type === 'human';
  const isAi = message.type === 'ai';
  const streaming = isAi && message.isStreaming === true;
  const recommendations = isAi ? (message.recommendations ?? []) : [];
  const widgets = isAi ? (message.widgets ?? []) : [];
  const textRef = useRef<View>(null);

  const openMenu = () =>
    textRef.current?.measureInWindow((x, y, width, height) => onLongPress(message, { x, y, width, height }));

  return (
    <View style={endsGroup ? styles.groupEnd : styles.groupGap}>
      {startsGroup ? (
        <View style={styles.nameRow}>
          <Avatar
            source={isHuman ? humanAstrologer.image : persona.avatar}
            ring={isHuman ? colors.humanRing : undefined}
            size={AVATAR_SIZE}
          />
          <Text style={[styles.name, isHuman && styles.humanName]}>{isHuman ? humanAstrologer.name : persona.name}</Text>
          <View style={[styles.badge, isHuman && styles.humanBadge]}>
            {isHuman ? <BadgeCheck size={12} color={colors.human} strokeWidth={2} /> : null}
            <Text style={[styles.badgeText, isHuman && styles.humanBadgeText]}>
              {isHuman ? 'Verified astrologer' : 'AI'}
            </Text>
          </View>
        </View>
      ) : null}

      {/* Only the text swipes; the card rail below keeps its own horizontal scroll. */}
      <SwipeToReply onReply={() => onAction('reply', message)} enabled={!streaming}>
        <Pressable
          ref={textRef}
          onLongPress={openMenu}
          disabled={streaming}
          delayLongPress={350}
          accessibilityHint="Swipe right to reply. Long press for more."
          style={({ pressed }) => [
            styles.reply,
            isHuman && styles.humanPanel,
            (pressed || selected) && (isHuman ? styles.humanPressed : styles.pressed),
          ]}
        >
          <Text style={styles.text}>
            {message.text}
            {streaming ? <Text style={styles.caret}> ▍</Text> : null}
          </Text>
        </Pressable>
      </SwipeToReply>

      {recommendations.length > 0 ? (
        <RecommendationRail recommendations={recommendations} onPress={onRecommendationPress} />
      ) : null}

      {!streaming && widgets.length > 0 ? (
        <View style={styles.widgets}>
          <WidgetList
            widgets={widgets}
            context={{
              isLatest: props.isLatest,
              kundli: props.kundli,
              savedKundli: props.savedKundli,
              personaName: persona.name,
              onQuickReply: props.onQuickReply,
              onSubmitKundli: props.onSubmitKundli,
              onEditKundli: props.onEditKundli,
            }}
          />
        </View>
      ) : null}

      {endsGroup && !streaming ? (
        <FeedbackBar
          feedback={isAi ? message.feedback : undefined}
          rateable={isAi}
          time={timeLabel(message.createdAt)}
          onCopy={() => onAction('copy', message)}
          onRate={(rating) => onRate(message.id, rating)}
          onToggleReason={(reason) => onToggleReason(message.id, reason)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  groupGap: {
    marginBottom: 12,
  },
  groupEnd: {
    marginBottom: 28,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.text,
  },
  humanName: {
    color: colors.human,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
  },
  humanBadge: {
    borderColor: colors.humanLineStrong,
    backgroundColor: colors.humanTint,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
  },
  humanBadgeText: {
    color: colors.human,
  },
  // Negative margin and matching padding give the pressed highlight room without shifting the text.
  reply: {
    marginHorizontal: -10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  humanPanel: {
    marginHorizontal: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.humanTint,
    borderWidth: 1,
    borderColor: colors.humanLine,
  },
  pressed: {
    backgroundColor: colors.surface,
  },
  humanPressed: {
    backgroundColor: colors.humanPressed,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 26,
    color: colors.text,
  },
  caret: {
    color: colors.faint,
  },
  widgets: {
    alignItems: 'flex-start',
  },
});
