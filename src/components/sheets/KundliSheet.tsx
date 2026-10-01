import { ScrollView, StyleSheet, Text } from 'react-native';

import type { Kundli } from '../../domain/kundli';
import { colors } from '../../theme/colors';
import { fonts, displayTracking } from '../../theme/typography';
import { KundliForm } from '../kundli/KundliForm';
import { Sheet } from '../Sheet';

type Props = {
  visible: boolean;
  initial: Kundli | null;
  onClose: () => void;
  onAttach: (kundli: Kundli) => void;
};

export function KundliSheet({ visible, initial, onClose, onAttach }: Props) {
  return (
    <Sheet visible={visible} onClose={onClose}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* A new key per opening resets the form to the latest saved details. */}
        <KundliForm
          key={visible ? 'open' : 'closed'}
          initial={initial}
          submitLabel={initial ? 'Update birth details' : 'Share in chat'}
          onSubmit={onAttach}
          header={
            <>
              <Text style={styles.title}>Your birth details</Text>
              <Text style={styles.caption}>With these, your astrologer reads your chart instead of guessing.</Text>
            </>
          }
        />
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: displayTracking(28),
    color: colors.text,
  },
  caption: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
});
