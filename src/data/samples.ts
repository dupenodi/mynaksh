import type { ChartAnalysis, Panchang, SessionSummary, TarotSpread } from '../domain/readings';
import type { Recommendation } from '../domain/recommendation';

/**
 * Example readings and cards for demo mode and the simulated chats. Live mode
 * never uses these: there the model writes every value.
 */

type Card = Omit<Recommendation, 'id'>;

export const sampleCards = {
  blueSapphire: {
    type: 'gemstone',
    title: 'Blue Sapphire',
    subtitle: 'For Saturn in your 10th house',
    image: 'blue-sapphire',
    why: 'Saturn is slowing your career house. Neelam steadies it, but it is strong, so try it for three days first.',
    facts: [
      { label: 'Planet', value: 'Saturn' },
      { label: 'Finger', value: 'Middle, right hand' },
      { label: 'Metal', value: 'Silver or panchdhatu' },
      { label: 'Start on', value: 'Saturday, after sunrise' },
      { label: 'Weight', value: '4–6 carat' },
    ],
  },
  ruby: {
    type: 'gemstone',
    title: 'Ruby',
    subtitle: 'To strengthen a shy Sun',
    image: 'ruby',
    why: 'Your Sun sits weak in the 12th, so people miss how capable you are. Manik helps you be seen.',
    facts: [
      { label: 'Planet', value: 'Sun' },
      { label: 'Finger', value: 'Ring, right hand' },
      { label: 'Metal', value: 'Gold or copper' },
      { label: 'Start on', value: 'Sunday, at sunrise' },
    ],
  },
  pearl: {
    type: 'gemstone',
    title: 'Pearl',
    subtitle: 'To calm a restless Moon',
    image: 'pearl',
    why: 'The Moon rules your sleep and moods, and it is under pressure right now. Moti cools it.',
    facts: [
      { label: 'Planet', value: 'Moon' },
      { label: 'Finger', value: 'Little, right hand' },
      { label: 'Metal', value: 'Silver' },
      { label: 'Start on', value: 'Monday evening' },
    ],
  },
  emerald: {
    type: 'gemstone',
    title: 'Emerald',
    subtitle: 'For Mercury, the planet of deals',
    image: 'emerald',
    why: 'Mercury rules your 4th house of property. Panna sharpens judgement in contracts and talks.',
    facts: [
      { label: 'Planet', value: 'Mercury' },
      { label: 'Finger', value: 'Little, right hand' },
      { label: 'Metal', value: 'Gold' },
      { label: 'Start on', value: 'Wednesday morning' },
    ],
  },
  shaniMantra: {
    type: 'mantra',
    title: 'Shani Beej Mantra',
    subtitle: '108 times on Saturdays',
    why: 'A gentle way to ask Saturn for patience while the work pays off.',
    facts: [
      { label: 'Best time', value: 'Saturday, after sunset' },
      { label: 'Facing', value: 'West' },
    ],
    extra: { mantra: 'Om Praam Preem Praum Sah Shanaischaraya Namah', meaning: 'I bow to Saturn, the slow and steady one.', count: 108 },
  },
  chandraMantra: {
    type: 'mantra',
    title: 'Chandra Mantra',
    subtitle: '108 times, Monday evening',
    why: 'Soothes the Moon, which rules sleep and feelings.',
    facts: [{ label: 'Best time', value: 'Monday, moonrise' }],
    extra: { mantra: 'Om Som Somaya Namah', meaning: 'I bow to the Moon, the giver of calm.', count: 108 },
  },
  saturdayRemedy: {
    type: 'remedy',
    title: 'Saturday Diya',
    subtitle: 'Sesame oil lamp for Saturn',
    why: 'A small weekly act of patience, which is exactly what Saturn asks of you.',
    facts: [
      { label: 'Day', value: 'Saturday evening' },
      { label: 'For', value: '11 Saturdays' },
    ],
    extra: {
      steps: [
        'Light a sesame oil diya under a peepal tree or at home facing west.',
        'Offer a handful of black sesame seeds.',
        'Sit for two minutes and name one thing you will finish this week.',
      ],
    },
  },
  sleepMeditation: {
    type: 'meditation',
    title: 'Moonlight Wind-down',
    subtitle: '10 minutes before bed',
    why: 'Your Moon is restless. This slows the breath and the mind before sleep.',
    facts: [
      { label: 'Duration', value: '10 minutes' },
      { label: 'Best time', value: 'After dinner, lights low' },
    ],
    extra: {
      steps: [
        'Sit up in bed, phone in another room.',
        'Breathe in for four counts, out for six. Ten rounds.',
        'Picture a full moon over still water.',
        'Lie down and let the breath go on its own.',
      ],
    },
  },
  rudraksha: {
    type: 'rudraksha',
    title: '7 Mukhi Rudraksha',
    subtitle: 'A gentler start than a stone',
    why: 'Good for steady money and less worry, and safe to wear while you decide on a gemstone.',
    facts: [
      { label: 'Mukhi', value: 'Seven' },
      { label: 'Ruling planet', value: 'Saturn' },
      { label: 'How to wear', value: 'Red thread, Monday morning' },
    ],
  },
  shaniPuja: {
    type: 'puja',
    title: 'Shani Shanti Puja',
    subtitle: 'This Saturday, in your name',
    why: 'For the bigger Saturn knot in your chart. Priests perform it and send you the video.',
    facts: [
      { label: 'Deity', value: 'Shani Dev' },
      { label: 'Temple', value: 'Shani Shingnapur' },
      { label: 'Best day', value: 'Saturday' },
    ],
  },
  vastuYantra: {
    type: 'yantra',
    title: 'Vastu Yantra',
    subtitle: 'For a calmer home',
    why: 'Mars is stirring the 4th house of home. A yantra at the entrance settles it.',
    facts: [
      { label: 'Planet', value: 'Mars' },
      { label: 'Placement', value: 'Above the main door' },
      { label: 'Direction', value: 'North-east' },
    ],
  },
  careerMuhurat: {
    type: 'muhurat',
    title: 'Best days to apply',
    subtitle: 'Next three weeks',
    why: 'Jupiter supports new beginnings on these days. Send the important mails then.',
    extra: {
      dates: [
        { date: 'Thu, 9 Oct', time: '10:40–12:15', note: 'Jupiter hora, Pushya nakshatra' },
        { date: 'Mon, 13 Oct', time: '09:10–10:30', note: 'Strong for interviews' },
        { date: 'Thu, 23 Oct', time: '11:00–13:20', note: 'Best of the month for offers' },
      ],
    },
  },
  propertyMuhurat: {
    type: 'muhurat',
    title: 'Days to sign papers',
    subtitle: 'Before Diwali',
    why: 'Mercury is clear and the Moon is in a fixed sign on these days. Good for anything legal.',
    extra: {
      dates: [
        { date: 'Wed, 8 Oct', time: '11:20–12:40', note: 'Mercury hora, Rohini' },
        { date: 'Fri, 17 Oct', time: '10:00–11:30', note: 'Fixed Moon, steady outcomes' },
      ],
    },
  },
  matchCharts: {
    type: 'compatibility',
    title: 'Match your charts',
    subtitle: 'Guna milan in 2 minutes',
    why: 'Before you decide anything, see where you two naturally fit and where you will need patience.',
  },
  tarotOffer: {
    type: 'tarot',
    title: 'Past, present, future',
    subtitle: 'A three-card spread',
    why: 'The chart shows the weather. The cards show what you can do about it this month.',
  },
  panchangOffer: {
    type: 'panchang',
    title: 'Today’s Panchang',
    subtitle: 'Good hours for you today',
  },
  weeklyHoroscope: {
    type: 'horoscope',
    title: 'Your week ahead',
    subtitle: 'Simha rashi',
    why: 'A busy week at work with a lucky Thursday. Say less in meetings and more in writing.',
    facts: [
      { label: 'Lucky day', value: 'Thursday' },
      { label: 'Lucky colour', value: 'Saffron' },
      { label: 'Focus', value: 'Finishing, not starting' },
    ],
  },
  saturnArticle: {
    type: 'article',
    title: 'Sade Sati, explained',
    subtitle: '6 minute read',
    why: 'Why Saturn’s seven and a half years feel heavy, and why most people come out stronger.',
  },
  meeraCall: (focus: string, minutes = 30) => ({
    type: 'consultation',
    title: `Talk to Acharya Meera`,
    subtitle: `${minutes} minutes · ${focus}`,
    why: 'She has 18 years of practice and reads this whole chat before your call.',
    extra: { focus, minutes },
  }),
  festiveOffer: {
    type: 'promotion',
    title: '15% off certified stones',
    subtitle: 'Ends Sunday',
    facts: [
      { label: 'Code', value: 'NAKSH15' },
      { label: 'Valid till', value: 'Sunday midnight' },
    ],
  },
} satisfies Record<string, Card | ((...args: never[]) => Card)>;

export function sampleAnalysis(sign = 'Simha', moon = 'Vrischika'): ChartAnalysis {
  return {
    headline: 'A strong Sun, a busy Saturn',
    placements: [
      { label: 'Sun', value: sign },
      { label: 'Moon', value: moon },
      { label: 'Ascendant', value: 'Tula' },
      { label: 'Current dasha', value: 'Saturn' },
    ],
    strengths: ['Natural leader, people trust you', 'Jupiter protects your money house'],
    challenges: ['Saturn slows career wins this year', 'A restless Moon disturbs sleep'],
  };
}

export function sampleTarot(question: string): TarotSpread {
  return {
    question,
    cards: [
      { name: 'The Tower', position: 'Past', reversed: false, meaning: 'Something you relied on fell away suddenly. It cleared the ground.' },
      { name: 'The Hermit', position: 'Present', reversed: false, meaning: 'A quiet phase. Work alone, skip the noise, trust your own lamp.' },
      { name: 'The Star', position: 'Future', reversed: false, meaning: 'Hope returns, and with it a clear offer. Keep going.' },
    ],
  };
}

export function samplePanchang(place = 'Bengaluru'): Panchang {
  return {
    date: new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }),
    place,
    tithi: 'Shukla Navami',
    nakshatra: 'Shravana',
    yoga: 'Siddhi',
    sunrise: '6:08 AM',
    sunset: '6:04 PM',
    rahuKaal: '12:06 – 1:36 PM',
    goodHours: ['10:40 – 11:50 AM', '4:15 – 5:30 PM'],
    note: 'A good day to begin learning or send an important message. Avoid signing anything during Rahu Kaal.',
  };
}

export function sampleSummary(name: string): SessionSummary {
  return {
    headline: `${name || 'Your'} path through a Saturn year`,
    insights: ['Saturn in the 10th is slowing, not blocking, your career', 'Your Moon needs rest more than answers'],
    remedies: ['Blue Sapphire, after a three-day trial', 'Shani mantra on Saturdays', 'Saturday diya for 11 weeks'],
    nextSteps: ['Apply on the muhurat dates', 'Sleep by 11 for a week', 'Your call with Acharya Meera'],
  };
}
