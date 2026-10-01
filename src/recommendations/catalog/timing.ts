import { defineGroup } from './defineGroup';

export const timing = defineGroup('timing', {
  panchang: {
    label: 'Panchang',
    glyph: '◐',
    tint: '#2F6B6B',
    wash: '#E3EFEE',
    cta: 'View today',
    image: require('../../../assets/images/panchang.jpg'),
    blurb: 'Tithi, nakshatra and auspicious hours for your city.',
    hint: 'offer today\'s panchang; when they accept, use the "panchang" widget',
    ask: "Show me today's panchang.",
  },
  muhurat: {
    label: 'Muhurat',
    glyph: '⧗',
    tint: '#3F5F2F',
    wash: '#E8EFE1',
    cta: 'See dates',
    image: require('../../../assets/images/muhurat.jpg'),
    blurb: 'The best dates and hours for the thing you are planning.',
    hint: 'the best dates for a specific plan they mentioned',
    fields: '"extra": {"dates": 3 or 4 items of {"date": "Tue, 14 Oct", "time": "10:30–12:10", "note": "why it is good, short"}}',
  },
});
