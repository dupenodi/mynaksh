import { record, text, textList } from '../../lib/read';
import type { WidgetDefinition } from './types';

export const summary: WidgetDefinition<'summary'> = {
  parse: (ui) => {
    const raw = record(ui.summary);
    const headline = text(raw, 'headline');
    if (!headline) {
      return undefined;
    }
    return {
      kind: 'summary',
      summary: {
        headline,
        insights: textList(raw, 'insights', 4),
        remedies: textList(raw, 'remedies', 4),
        nextSteps: textList(raw, 'nextSteps', 3),
      },
    };
  },
  encode: (widget) => ({ summary: widget.summary }),
  prompt:
    '"summary": {"headline", "insights": 2 to 4 things you found, "remedies": what you suggested, "nextSteps": 1 to 3 things to do this week}. Only when wrapping up the session.',
};
