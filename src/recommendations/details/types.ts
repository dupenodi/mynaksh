import type { ReactElement } from 'react';

import type { ConsultationBooking } from '../../domain/consultation';
import type { Recommendation } from '../../domain/recommendation';
import type { ResolvedExperience } from '../catalog';

/** What a detail view can do. The screen decides what each one means. */
export type DetailActions = {
  close: () => void;
  /** Close and confirm with a toast, e.g. "Reminder set for Tue, 14 Oct". */
  confirm: (message: string) => void;
  /** Close and send this to the astrologer as the user's next message. */
  ask: (text: string) => void;
  book: (booking: ConsultationBooking) => void;
};

export type DetailProps = {
  recommendation: Recommendation;
  look: ResolvedExperience;
  actions: DetailActions;
};

export type DetailComponent = (props: DetailProps) => ReactElement;
