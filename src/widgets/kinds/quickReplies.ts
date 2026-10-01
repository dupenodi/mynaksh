import { textList } from '../../lib/read';
import type { WidgetDefinition } from './types';

export const quickReplies: WidgetDefinition<'quick_replies'> = {
  parse: (ui) => {
    const options = textList(ui, 'replies', 3);
    return options.length > 0 ? { kind: 'quick_replies', options } : undefined;
  },
  encode: (widget) => ({ replies: widget.options }),
  prompt: '"replies": 2 or 3 short things the person might tap to answer you, under 30 characters, written as the user would say them.',
};
