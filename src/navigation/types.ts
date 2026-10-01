import type { PersonaId } from '../domain/personas';

export type RootStackParamList = {
  Astrologers: undefined;
  Profile: { personaId: PersonaId };
  Chat: { personaId: PersonaId };
};
