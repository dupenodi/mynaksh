import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { KundliForm } from '../../components/kundli/KundliForm';
import { formatBirthDate, type Kundli } from '../../domain/kundli';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import type { WidgetProps } from '../types';
import { surfaceCard } from './WidgetCard';

/** The inline form until a kundli is shared, then a one-line receipt with Edit. */
export function KundliFormWidget({ context }: WidgetProps<'kundli_form'>) {
  const { kundli, savedKundli, personaName, onSubmitKundli, onEditKundli } = context;

  if (kundli) {
    return <SharedKundli kundli={kundli} onEdit={onEditKundli} />;
  }
  return (
    <View style={styles.card}>
      <KundliForm
        initial={savedKundli}
        submitLabel={`Share with ${personaName}`}
        onSubmit={onSubmitKundli}
        header={<Text style={styles.title}>Your birth details</Text>}
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
  card: {
    ...surfaceCard,
    maxWidth: 420,
    marginTop: 10,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
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
    borderRadius: 10,
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
