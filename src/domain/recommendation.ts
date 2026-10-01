import type { KnownRecommendationType } from '../recommendations/catalog';

/** A labelled detail shown in the card's sheet, e.g. { label: 'Finger', value: 'Middle, right hand' }. */
export type Fact = { label: string; value: string };

export type Recommendation = {
  id: string;
  /** Known types autocomplete; unknown strings from the backend or the model are still allowed. */
  type: KnownRecommendationType | (string & {});
  title: string;
  subtitle?: string;
  /** An image key such as "ruby", looked up in the image set for this type. Unknown keys fall back to the type's art. */
  image?: string;
  /** Why the astrologer suggests it, in a sentence or two. */
  why?: string;
  facts?: Fact[];
  /** Fields only some types use (mantra text, remedy steps, muhurat dates…). Each detail view parses what it needs. */
  extra?: Record<string, unknown>;
};
