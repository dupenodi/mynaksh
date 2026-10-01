import { objectList, record, text, textList } from '../../lib/read';
import type { WidgetDefinition } from './types';

export const analysis: WidgetDefinition<'analysis'> = {
  parse: (ui) => {
    const raw = record(ui.analysis);
    const headline = text(raw, 'headline');
    if (!raw || !headline) {
      return undefined;
    }
    const placements = objectList(raw, 'placements', (item) => {
      const label = text(item, 'label');
      const value = text(item, 'value');
      return label && value ? { label, value } : undefined;
    });
    return {
      kind: 'analysis',
      analysis: {
        headline,
        placements,
        strengths: textList(raw, 'strengths', 3),
        challenges: textList(raw, 'challenges', 3),
      },
    };
  },
  encode: (widget) => ({ analysis: widget.analysis }),
  prompt:
    '"analysis": {"headline": under 8 words, "placements": 4 of {"label","value"} for Sun, Moon, Ascendant and Current dasha, each value 1 to 3 words (e.g. "Makara", "Saturn – Mercury"), "strengths": 2 or 3 phrases under 8 words, "challenges": 2 or 3 phrases under 8 words}. Your first reading right after they share birth details.',
};
