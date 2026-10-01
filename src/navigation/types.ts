import type { Mode } from '../data/replies';
import type { PersonaId } from '../domain/personas';

export type RootStackParamList = {
  Astrologers: undefined;
  Profile: { personaId: PersonaId };
  /** demo: the persona's simulated session. live: a real conversation with the model. */
  Chat: { personaId: PersonaId; mode: Mode };
};
