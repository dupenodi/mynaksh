import { humanAstrologer } from '../../domain/advisors';
import { slotLabel } from '../../domain/consultation';
import type { Kundli } from '../../domain/kundli';
import { sampleCards } from '../samples';
import { ai, bookedSlot, buildChat, human, system, user } from './build';

const priya: Kundli = { name: 'Priya Nair', dateOfBirth: '1996-11-12', timeOfBirth: '21:15', placeOfBirth: 'Pune' };

/** A breakup: comfort first, a love reading, Moon remedies, a horoscope and a human call. */
export function sanjuBabaChat() {
  const slot = slotLabel(bookedSlot());
  return buildChat(
    'sim-sanju',
    [
      system('Your session with Sanju Baba has started.'),
      user('Baba, mera breakup ho gaya. Three years. I can’t sleep.'),
      ai('Arre, idhar aa. Pehle ek jaadu ki jhappi le. Dil toota hai toh dard toh hoga. Thoda apni details de, apun dekhta hai stars kya bol rahe.', {
        form: 'kundli',
      }),
      user('Here are my birth details.', priya),
      ai(
        'Priya, tera Sun Vrischika mein hai, bole toh deep feelings wala banda. Aur Moon thoda pareshan hai abhi, isliye neend nahi aa rahi.',
        {
          analysis: {
            headline: 'Deep heart, tired Moon',
            placements: [
              { label: 'Sun', value: 'Vrischika' },
              { label: 'Moon', value: 'Karka' },
              { label: 'Venus', value: 'In the 7th house' },
              { label: 'Current dasha', value: 'Rahu – Moon' },
            ],
            strengths: ['Loyal, loves with full heart', 'Venus in the 7th promises a good partner later'],
            challenges: ['Rahu confuses love decisions till March', 'Moon under pressure, sleep suffers'],
          },
          replies: ['Will he come back?', 'Why can’t I sleep?'],
        },
      ),
      user('Will he come back?'),
      ai('Seedha bolu? Cards se poochte hai, apun jhooth nahi bolega.', { cards: [sampleCards.tarotOffer, sampleCards.matchCharts] }),
      user('Please draw the cards for me.'),
      ai('Chal, ek ek karke palat.', {
        tarot: {
          question: 'Priya’s heart, after the breakup',
          cards: [
            { name: 'The Lovers', position: 'Past', reversed: true, meaning: 'You two wanted different futures for a while. It was not only one person’s fault.' },
            { name: 'The Moon', position: 'Present', reversed: false, meaning: 'Confusion and late-night overthinking. Do not decide anything at 2 AM.' },
            { name: 'The Sun', position: 'Future', reversed: false, meaning: 'Joy comes back, and someone warmer with it. Not him, mamu.' },
          ],
        },
      }),
      user('Okay. How do I at least sleep properly?'),
      ai('Moon ko thanda karna padega. Yeh teen cheez try kar, bindaas neend aayegi.', {
        cards: [sampleCards.sleepMeditation, sampleCards.chandraMantra, sampleCards.pearl],
      }),
      user('What does my week look like?'),
      ai('Is hafte kaam mein mann laga. Thursday lucky hai, ekdum.', { cards: [{ ...sampleCards.weeklyHoroscope, subtitle: 'Vrischika rashi' }] }),
      user('Can I talk to someone real about this?'),
      ai('Bilkul. Meera didi bahut samajhdaar hai. Apun bhi unse advice leta hai.', {
        cards: [sampleCards.meeraCall('Love and moving on', 45)],
      }),
      system(`Call booked with ${humanAstrologer.name} · ${slot} · 45 min`),
      system(`${humanAstrologer.name} joined the chat`),
      human(
        `Hi Priya, I’m Meera. I’m sorry about the breakup, three years is a lot to carry. I read your chat, and I’ll call you ${slot.toLowerCase()}. Until then, try the wind-down tonight and tell me how you slept.`,
      ),
      user('Thank you Baba, I feel lighter.'),
      ai(
        'Yeh hui na baat! Tension nahi lene ka. Yeh rakh apne paas, aur ek aur jhappi le.',
        {
          summary: {
            headline: 'Priya, moving towards the Sun',
            insights: ['Rahu is clouding love decisions until March', 'The cards end on The Sun, joy returns'],
            remedies: ['Moonlight wind-down every night', 'Chandra mantra on Mondays', 'Pearl in silver'],
            nextSteps: ['No big decisions at night', 'Sleep by 11 for a week', `Call with Meera, ${slot.toLowerCase()}`],
          },
        },
        true,
      ),
    ],
    40,
  );
}
