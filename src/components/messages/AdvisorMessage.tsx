import { BadgeCheck } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { humanAstrologer } from '../../domain/advisors';
import type { Kundli } from '../../domain/kundli';
import type { AiMessage, HumanMessage } from '../../domain/message';
import type { Persona } from '../../domain/personas';
import { RecommendationRail } from '../../recommendations/RecommendationRail';
import { timeLabel } from '../../state/timeline';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { WidgetList } from '../../widgets/registry';
import type { WidgetContext } from '../../widgets/types';
import { Avatar } from '../Avatar';
import { FeedbackBar } from './FeedbackBar';
import { ADVISOR_GROUP_END, ADVISOR_GROUP_GAP, LONG_PRESS_MS } from './spacing';
import { SwipeToReply } from './SwipeToReply';
import type { MessageActions, MessageLayout } from './types';
import { useMenuAnchor } from './useMenuAnchor';

const AVATAR_SIZE = 26;

type Props = {
  message: AiMessage | HumanMessage;
  layout: MessageLayout;
  persona: Persona;
  kundli: Kundli | null;
  savedKundli: Kundli | null;
  actions: MessageActions;
};

/**
 * Advisor replies read like a page, not a bubble: a name line, then full-width text.
 * Only the human astrologer keeps a tinted panel, so a real person stays visibly different.
 */
export function AdvisorMessage({ message, layout, persona, kundli, savedKundli, actions }: Props) {
  const isHuman = message.type === 'human';
  const isAi = message.type === 'ai';
  const streaming = isAi && message.isStreaming === true;
  const recommendations = isAi ? (message.recommendations ?? []) : [];
  const widgets = isAi ? (message.widgets ?? []) : [];
  const { ref, open } = useMenuAnchor(message, actions.onLongPress);

  return (
    <View style={layout.endsGroup ? styles.groupEnd : styles.groupGap}>
      {layout.startsGroup ? <AdvisorHeader isHuman={isHuman} persona={persona} /> : null}

      {/* Only the text swipes; the card rail below keeps its own horizontal scroll. */}
      <SwipeToReply onReply={() => actions.onAction('reply', message)} enabled={!streaming}>
        <Pressable
          ref={ref}
          onLongPress={open}
          disabled={streaming}
          delayLongPress={LONG_PRESS_MS}
          accessibilityHint="Swipe right to reply. Long press for more."
          style={({ pressed }) => [
            styles.reply,
            isHuman && styles.humanPanel,
            (pressed || layout.selected) && (isHuman ? styles.humanPressed : styles.pressed),
          ]}
        >
          <Text style={styles.text}>
            {message.text}
            {streaming ? <Text style={styles.caret}> ▍</Text> : null}
          </Text>
        </Pressable>
      </SwipeToReply>

      {recommendations.length > 0 ? (
        <RecommendationRail recommendations={recommendations} onPress={actions.onRecommendationPress} />
      ) : null}

      {!streaming && widgets.length > 0 ? (
        <View style={styles.widgets}>
          <WidgetList widgets={widgets} context={widgetContext(layout, persona, kundli, savedKundli, actions)} />
        </View>
      ) : null}

      {layout.endsGroup && !streaming ? (
        <FeedbackBar
          feedback={isAi ? message.feedback : undefined}
          rateable={isAi}
          time={timeLabel(message.createdAt)}
          onCopy={() => actions.onAction('copy', message)}
          onRate={(rating) => actions.onRate(message.id, rating)}
          onToggleReason={(reason) => actions.onToggleReason(message.id, reason)}
        />
      ) : null}
    </View>
  );
}

function AdvisorHeader({ isHuman, persona }: { isHuman: boolean; persona: Persona }) {
  return (
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
  );
}

function widgetContext(
  layout: MessageLayout,
  persona: Persona,
  kundli: Kundli | null,
  savedKundli: Kundli | null,
  actions: MessageActions,
): WidgetContext {
  return {
    isLatest: layout.isLatest,
    kundli,
    savedKundli,
    personaName: persona.name,
    onQuickReply: actions.onQuickReply,
    onSubmitKundli: actions.onSubmitKundli,
    onEditKundli: actions.onEditKundli,
  };
}

const styles = StyleSheet.create({
  groupGap: {
    marginBottom: ADVISOR_GROUP_GAP,
  },
  groupEnd: {
    marginBottom: ADVISOR_GROUP_END,
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
