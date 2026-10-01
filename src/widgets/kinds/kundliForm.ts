import type { WidgetDefinition } from './types';

export const kundliForm: WidgetDefinition<'kundli_form'> = {
  parse: (ui) => (ui.form === 'kundli' ? { kind: 'kundli_form' } : undefined),
  encode: () => ({ form: 'kundli' }),
  prompt:
    '"form": "kundli" shows a birth details form. Use it when you need their birth details and don\'t have them. Also ask in words.',
};
