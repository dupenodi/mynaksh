import { humanAstrologer } from '../../domain/advisors';
import { slotLabel } from '../../domain/consultation';
import type { Kundli } from '../../domain/kundli';
import { sampleCards, samplePanchang } from '../samples';
import { ai, bookedSlot, buildChat, human, system, user } from './build';

const aarav: Kundli = { name: 'Aarav Mehta', dateOfBirth: '1998-08-24', timeOfBirth: '06:40', placeOfBirth: 'Bengaluru' };

/** Career and job hunting: the full arc, from birth details to a booked call and a summary. */
export function dhuniBabaChat() {
  const slot = slotLabel(bookedSlot());
  return buildChat('sim-dhuni', [
    system('Your session with Dhuni Baba has started.'),
    user('Baba, I have been applying for jobs for four months. Nothing is working.'),
    ai('Four months is a long monsoon, bachcha. Before I say anything, let me see your stars properly. Share your birth details below.', { form: 'kundli' }),
    user('Here are my birth details.', aarav),
    ai(
      'Ah, Aarav. Sun in Simha, born at sunrise in Bengaluru. A leader’s chart, like Bheem’s. But Saturn is sitting heavily on your career house right now.',
      {
        analysis: {
          headline: 'A leader’s Sun under a slow Saturn',
          placements: [
            { label: 'Sun', value: 'Simha' },
            { label: 'Moon', value: 'Makara' },
            { label: 'Ascendant', value: 'Simha' },
            { label: 'Current dasha', value: 'Saturn – Mercury' },
          ],
          strengths: ['Natural authority, interviewers remember you', 'Jupiter guards your income house'],
          challenges: ['Saturn in the 10th delays results', 'Mercury makes you over-explain'],
        },
        replies: ['Why is it so slow?', 'Will it get better?'],
      },
      true,
    ),
    user('Why is it so slow? I am doing everything right.'),
    ai(
      'You are, bachcha. Saturn is not punishing you, it is testing patience, like Raja Indravarma’s treasurer counting every coin twice. Shall we ask the cards what this month holds?',
      { cards: [sampleCards.tarotOffer] },
    ),
    user('Please draw the cards for me.'),
    ai('Turn them over slowly, one by one. Even laddoos taste better when you wait.', {
      tarot: {
        question: 'Aarav’s job search this month',
        cards: [
          { name: 'The Tower', position: 'Past', reversed: false, meaning: 'The old job ending shook you, but it cleared the ground for something truer.' },
          { name: 'The Hermit', position: 'Present', reversed: false, meaning: 'Fewer, better applications. Prepare quietly instead of applying everywhere.' },
          { name: 'Wheel of Fortune', position: 'Future', reversed: false, meaning: 'A turn is coming within weeks. Be ready when the phone rings.' },
        ],
      },
    }),
    user('The Wheel of Fortune gives me hope. What can I do in the meantime?'),
    ai('Three small things, bachcha. A stone for Saturn, a mantra for patience, and one ritual every Saturday. Start with the ritual, it costs nothing.', {
      cards: [sampleCards.saturdayRemedy, sampleCards.shaniMantra, sampleCards.blueSapphire, sampleCards.festiveOffer],
    }),
    user('When should I send the important applications?'),
    ai('Ah, timing! Jupiter opens a few doors this month. Send your best ones on these days.', {
      cards: [sampleCards.careerMuhurat, sampleCards.panchangOffer],
    }),
    user('Show me today’s panchang.'),
    ai('Here is today in Bengaluru. Write to that recruiter in the good hours, not during Rahu Kaal.', { panchang: samplePanchang('Bengaluru') }),
    user('Can I also talk to a real astrologer once?'),
    ai('Of course. Meera has read more charts than I have eaten laddoos, almost. She will go deeper into your Saturn.', {
      cards: [sampleCards.meeraCall('Career and Saturn')],
    }),
    system(`Call booked with ${humanAstrologer.name} · ${slot} · 30 min`),
    system(`${humanAstrologer.name} joined the chat`),
    human(
      `Namaste Aarav, I’m Meera. I read your chat with Dhuni Baba, and that Saturn in the 10th is exactly where I want to start. I’ll call you ${slot.toLowerCase()}. Could you note the two roles you want most?`,
    ),
    user('Thank you Baba, this really helped.'),
    ai('Go well, bachcha. Patience, preparation, and one less laddoo. Here is everything we spoke about.', {
      summary: {
        headline: 'Aarav’s Saturn season',
        insights: ['Saturn in the 10th is delaying, not denying, the job', 'A turn of fortune is due within weeks'],
        remedies: ['Saturday diya for 11 weeks', 'Shani mantra, 108 times', 'Blue Sapphire after a 3-day trial'],
        nextSteps: ['Apply on 9 and 13 Oct', 'Prepare for two roles, not twenty', `Call with Meera, ${slot.toLowerCase()}`],
      },
    }),
  ]);
}
