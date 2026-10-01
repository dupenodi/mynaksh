import type { Fact } from './recommendation';

// Structured readings the astrologer writes and the chat draws as inline widgets.

export type ChartAnalysis = {
  headline: string;
  /** e.g. Sun: Simha, Moon: Vrischika, Current dasha: Saturn. */
  placements: Fact[];
  strengths: string[];
  challenges: string[];
};

export type TarotCard = {
  name: string;
  /** Where it sits in the spread, e.g. Past, Present, Future. */
  position: string;
  reversed: boolean;
  meaning: string;
};

export type TarotSpread = {
  question?: string;
  cards: TarotCard[];
};

export type Panchang = {
  date: string;
  place?: string;
  tithi: string;
  nakshatra: string;
  yoga?: string;
  sunrise?: string;
  sunset?: string;
  rahuKaal?: string;
  goodHours: string[];
  note?: string;
};

export type SessionSummary = {
  headline: string;
  insights: string[];
  remedies: string[];
  nextSteps: string[];
};
