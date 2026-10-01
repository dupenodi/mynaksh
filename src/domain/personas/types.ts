import type { ImageSourcePropType } from 'react-native';

export type PersonaId = 'dhuni-baba' | 'kantara' | 'sanju-baba';

export type Review = { author: string; rating: number; text: string };

// Lines the demo script uses, so each persona sounds like itself without an API key.
export type DemoLines = {
  askKundli: string;
  haveKundli: (name: string) => string;
  welcomeChart: (name: string, sign: string, place: string) => string;
  career: (name: string) => string;
  love: (name: string) => string;
  health: string;
  gemstone: string;
  fallback: string;
};

export type Persona = {
  id: PersonaId;
  name: string;
  title: string;
  inspiredBy: string;
  emblem: string;
  avatar: ImageSourcePropType;
  theme: { accent: string; tint: string; deep: string };
  tagline: string;
  bio: string;
  quote: string;
  stats: { rating: number; reviews: string; consultations: string; experience: string };
  fee: string;
  replyTime: string;
  languages: string[];
  specialties: string[];
  reviews: Review[];
  suggestions: string[];
  placeholder: string;
  voice: string;
  demo: DemoLines;
};
