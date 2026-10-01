import { BadgeCheck } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { humanAstrologer } from '../../domain/advisors';
import type { AiMessage, HumanMessage } from '../../domain/message';
import { resolveRecommendationCard } from '../../recommendations/registry';
import { timeLabel } from '../../state/timeline';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Avatar } from '../Avatar';
import { AVATAR_GAP, AVATAR_SIZE, SCREEN_GUTTER } from '../layout';
import { FeedbackBar } from './FeedbackBar';
import type { MessageRowProps } from './MessageRow';
import { MessageWidgets } from './MessageWidgets';

// Width of a card plus its gap, so the rail snaps one card at a time.
const CARD_STEP = 212;

export function AdvisorMessage(props: MessageRowProps & { message: AiMessage | HumanMessage }) {
  const { message, persona, startsGroup, endsGroup, onLongPress, onRecommendationPress, onRate, onToggleReason } = props;
  const isHuman = message.type === 'human';
  const isAi = message.type === 'ai';
  const streaming = isAi && message.isStreaming === true;
  const recommendations = isAi ? (message.recommendations ?? []) : [];
  const widgets = isAi ? (message.widgets ?? []) : [];

  return (
    <View style={endsGroup ? styles.groupEnd : styles.groupGap}>
      <View style={styles.row}>
        <View style={styles.avatarSlot}>
          {startsGroup ? (
            <Avatar
              source={isHuman ? humanAstrologer.image : persona.avatar}
              ring={isHuman ? colors.human : persona.theme.accent}
              size={AVATAR_SIZE}
            />
          ) : null}
        </View>

        <View style={styles.body}>
          {startsGroup ? (
            <View style={styles.nameRow}>
              <Text style={[styles.name, isHuman && styles.humanName]}>{isHuman ? humanAstrologer.name : persona.name}</Text>
              <View style={[styles.badge, isHuman && styles.humanBadge]}>
                {isHuman ? <BadgeCheck size={12} color={colors.human} strokeWidth={2} /> : null}
                <Text style={[styles.badgeText, isHuman && styles.humanBadgeText]}>
                  {isHuman ? 'Verified astrologer' : 'AI'}
                </Text>
              </View>
            </View>
          ) : null}

          <Pressable
            onLongPress={() => onLongPress(message)}
            delayLongPress={350}
            accessibilityHint="Long press for options"
            style={({ pressed }) => [
              styles.bubble,
              startsGroup && styles.bubbleFirst,
              isHuman && styles.humanBubble,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.text}>
              {message.text}
              {streaming ? <Text style={[styles.caret, { color: persona.theme.accent }]}> ▍</Text> : null}
            </Text>
          </Pressable>

        </View>
      </View>

      {recommendations.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.rail}
          contentContainerStyle={styles.railContent}
          decelerationRate="fast"
          snapToInterval={CARD_STEP}
          snapToAlignment="start"
        >
          {recommendations.map((recommendation) => {
            const Card = resolveRecommendationCard(recommendation.type);
            return <Card key={recommendation.id} recommendation={recommendation} onPress={onRecommendationPress} />;
          })}
        </ScrollView>
      ) : null}

      {!streaming && widgets.length > 0 ? (
        <View style={styles.widgets}>
          <MessageWidgets
            widgets={widgets}
            isLatest={props.isLatest}
            kundli={props.kundli}
            savedKundli={props.savedKundli}
            personaName={persona.name}
            onQuickReply={props.onQuickReply}
            onSubmitKundli={props.onSubmitKundli}
            onEditKundli={props.onEditKundli}
          />
        </View>
      ) : null}

      {endsGroup && !streaming ? (
        <View style={styles.footer}>
          <Text style={styles.meta}>{timeLabel(message.createdAt)}</Text>
          {isAi ? (
            <FeedbackBar
              feedback={message.feedback}
              onRate={(rating) => onRate(message.id, rating)}
              onToggleReason={(reason) => onToggleReason(message.id, reason)}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  groupGap: {
    marginBottom: 4,
  },
  groupEnd: {
    marginBottom: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarSlot: {
    width: AVATAR_SIZE,
    marginRight: AVATAR_GAP,
  },
  body: {
    flex: 1,
    alignItems: 'flex-start',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    minHeight: AVATAR_SIZE / 2,
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
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.accentSoft,
  },
  humanBadge: {
    backgroundColor: colors.humanTint,
  },
  badgeText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.accent,
  },
  humanBadgeText: {
    color: colors.human,
  },
  bubble: {
    maxWidth: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  bubbleFirst: {
    borderTopLeftRadius: 6,
  },
  humanBubble: {
    backgroundColor: colors.humanTint,
    borderColor: 'rgba(163, 196, 165, 0.22)',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  caret: {
    color: colors.accent,
  },
  // Negative margin lets the rail reach the screen edges; padding lines the first card up with the bubble.
  rail: {
    marginTop: 12,
    marginHorizontal: -SCREEN_GUTTER,
  },
  railContent: {
    paddingLeft: SCREEN_GUTTER + AVATAR_SIZE + AVATAR_GAP,
    paddingRight: SCREEN_GUTTER - 12,
    paddingTop: 2,
    paddingBottom: 10,
  },
  widgets: {
    marginLeft: AVATAR_SIZE + AVATAR_GAP,
    alignItems: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: AVATAR_SIZE + AVATAR_GAP,
    marginTop: 4,
    gap: 12,
  },
  meta: {
    marginTop: 9,
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.faint,
  },
});
