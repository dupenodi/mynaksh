import { TAROT_CARDS, tarotName } from '../../media/imageSets';
import { objectList, record, text } from '../../lib/read';
import type { WidgetDefinition } from './types';

export const tarot: WidgetDefinition<'tarot'> = {
  parse: (ui) => {
    const raw = record(ui.tarot);
    const cards = objectList(
      raw,
      'cards',
      (item) => {
        const name = text(item, 'name');
        const meaning = text(item, 'meaning');
        return name && meaning
          ? { name: tarotName(name), meaning, position: text(item, 'position') ?? '', reversed: item.reversed === true }
          : undefined;
      },
      3,
    );
    return cards.length > 0 ? { kind: 'tarot', spread: { question: text(raw, 'question'), cards } } : undefined;
  },
  encode: (widget) => ({ tarot: widget.spread }),
  prompt: `"tarot": {"question": what the spread is about, "cards": exactly 3 of {"name": one of ${TAROT_CARDS.join(', ')}, "position": Past, Present or Future (or Situation, Challenge, Advice), "reversed": true or false, "meaning": one sentence for their situation}}. Draw different cards each time, and keep your text short because the cards carry the reading.`,
};
