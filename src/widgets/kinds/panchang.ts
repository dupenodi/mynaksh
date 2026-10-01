import { record, text, textList } from '../../lib/read';
import type { WidgetDefinition } from './types';

export const panchang: WidgetDefinition<'panchang'> = {
  parse: (ui) => {
    const raw = record(ui.panchang);
    const date = text(raw, 'date');
    const tithi = text(raw, 'tithi');
    const nakshatra = text(raw, 'nakshatra');
    if (!date || !tithi || !nakshatra) {
      return undefined;
    }
    return {
      kind: 'panchang',
      panchang: {
        date,
        tithi,
        nakshatra,
        place: text(raw, 'place'),
        yoga: text(raw, 'yoga'),
        sunrise: text(raw, 'sunrise'),
        sunset: text(raw, 'sunset'),
        rahuKaal: text(raw, 'rahuKaal'),
        goodHours: textList(raw, 'goodHours', 3),
        note: text(raw, 'note'),
      },
    };
  },
  encode: (widget) => ({ panchang: widget.panchang }),
  prompt:
    '"panchang": {"date", "place": their birth city or the city they mention, "tithi", "nakshatra", "yoga", "sunrise", "sunset", "rahuKaal": time range, "goodHours": 1 to 3 time ranges, "note": one line on what today is good for, for them}. Use today\'s date.',
};
