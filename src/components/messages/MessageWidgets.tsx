import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { formatBirthDate, type Kundli } from '../../domain/kundli';
import type { ReplyWidget } from '../../domain/message';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Chip } from '../Chip';
import { KundliForm } from '../kundli/KundliForm';

type Props = {
  widgets: ReplyWidget[];
  isLatest: boolean;
  kundli: Kundli | null;
  savedKundli: Kundli | null;
  personaName: string;
  onQuickReply: (text: string) => void;
  onSubmitKundli: (kundli: Kundli) => void;
  onEditKundli: () => void;
};

export function MessageWidgets(props: Props) {
  const { widgets, isLatest, kundli, onQuickReply, onSubmitKundli, onEditKundli } = props;
  return (
    <>
      {widgets.map((widget) => {
        switch (widget.kind) {
          case 'kundli_form':
            return kundli ? (
              <SharedKundli key={widget.kind} kundli={kundli} onEdit={onEditKundli} />
            ) : (
              <InlineKundliForm
                key={widget.kind}
                initial={props.savedKundli}
                personaName={props.personaName}
                onSubmit={onSubmitKundli}
              />
            );
          case 'quick_replies':
            // Old suggestions would answer a question that has moved on, so only the latest shows them.
            return isLatest ? (
              <Animated.View key={widget.kind} entering={FadeIn.delay(150)} style={styles.replies}>
                {widget.options.map((option) => (
                  <Chip key={option} label={option} tone="suggestion" onPress={() => onQuickReply(option)} />
                ))}
              </Animated.View>
            ) : null;
        }
      })}
    </>
  );
}

type InlineFormProps = {
  initial: Kundli | null;
  personaName: string;
  onSubmit: (kundli: Kundli) => void;
};

function InlineKundliForm({ initial, personaName, onSubmit }: InlineFormProps) {
  return (
    <View style={styles.card}>
      <KundliForm
        initial={initial}
        submitLabel={`Share with ${personaName}`}
        onSubmit={onSubmit}
        header={
          <>
            <Text style={styles.title}>Your birth details</Text>
          </>
        }
      />
    </View>
  );
}

function SharedKundli({ kundli, onEdit }: { kundli: Kundli; onEdit: () => void }) {
  return (
    <View style={styles.shared}>
      <Check size={14} color={colors.human} strokeWidth={2.25} />
      <Text style={styles.sharedText} numberOfLines={1}>
        Shared {kundli.name}, born {formatBirthDate(kundli.dateOfBirth)}
      </Text>
      <Pressable onPress={onEdit} accessibilityRole="button" hitSlop={8}>
        <Text style={styles.edit}>Edit</Text>
      </Pressable>
    </View>
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
  card: {
    width: '100%',
    maxWidth: 420,
    marginTop: 10,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 28,
    color: colors.text,
  },
  shared: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.humanTint,
  },
  sharedText: {
    flexShrink: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.human,
  },
  edit: {
    marginLeft: 4,
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.text,
  },
});
