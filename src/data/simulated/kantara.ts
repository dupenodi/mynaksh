import type { Kundli } from '../../domain/kundli';
import { sampleCards } from '../samples';
import { ai, buildChat, system, user } from './build';

const deepa: Kundli = { name: 'Deepa Shetty', dateOfBirth: '1989-01-30', placeOfBirth: 'Udupi' };

/** A family land dispute: property remedies, a puja, signing dates and a reading. */
export function kantaraChat() {
  return buildChat(
    'sim-kantara',
    [
      system('Your session with Kantara has started.'),
      user('My brother and I are fighting over our father’s land. It is tearing the family apart.'),
      ai('Land remembers everything… so do I. Give me the day and place you arrived. Then we speak.', { form: 'kundli' }),
      user('Here are my birth details.', deepa),
      ai(
        'Deepa. Sun in Makara. Born near the sea. I don’t know your birth time, so I read the Moon. Your fourth house, the house of land and home, is burning.',
        {
          analysis: {
            headline: 'Strong roots, a burning fourth house',
            placements: [
              { label: 'Sun', value: 'Makara' },
              { label: 'Moon', value: 'Mesha' },
              { label: 'Mars', value: 'In the 4th house' },
              { label: 'Current dasha', value: 'Mars – Rahu' },
            ],
            strengths: ['Patient, like the forest', 'Saturn rewards fairness in your chart'],
            challenges: ['Mars stirs anger at home', 'Rahu clouds family trust until spring'],
          },
          replies: ['Will the dispute end?', 'Is my brother wrong?'],
        },
      ),
      user('Will the dispute end?'),
      ai('It will. Not by winning. By settling. Let the cards show the path.', { cards: [sampleCards.tarotOffer] }),
      user('Please draw the cards for me.'),
      ai('Turn them.', {
        tarot: {
          question: 'The land between Deepa and her brother',
          cards: [
            { name: 'The Emperor', position: 'Situation', reversed: true, meaning: 'Your father’s authority is gone, and both of you are trying to fill his chair.' },
            { name: 'Justice', position: 'Challenge', reversed: false, meaning: 'A fair division exists. Someone has to say it first.' },
            { name: 'Temperance', position: 'Advice', reversed: false, meaning: 'Meet in the middle, slowly. A neutral elder helps.' },
          ],
        },
      }),
      user('What can I do to calm things at home?'),
      ai('Cool Mars. Clear the house. Then speak.', {
        cards: [sampleCards.vastuYantra, sampleCards.emerald, sampleCards.shaniPuja],
      }),
      user('If we agree, when should we sign the papers?'),
      ai('Not in a hurry. On these days, the Moon holds steady.', { cards: [sampleCards.propertyMuhurat, sampleCards.saturnArticle] }),
      user('Thank you, Kantara.'),
      ai(
        'Sari. The land was here before both of you. It will be here after. Go gently.',
        {
          summary: {
            headline: 'Settling, not winning',
            insights: ['Mars in the 4th fuels the fight at home', 'Justice favours an even split, said first by you'],
            remedies: ['Vastu yantra above the main door', 'Emerald for clear talks', 'Shani Shanti puja on Saturday'],
            nextSteps: ['Ask a neutral elder to sit with you both', 'Sign on 8 or 17 Oct, if you agree'],
          },
        },
        true,
      ),
    ],
    55,
  );
}
