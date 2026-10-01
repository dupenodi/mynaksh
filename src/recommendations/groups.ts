import type { ExperienceGroup, ExperienceGroupId } from './types';

/** Listed in the order the live prompt describes them. */
export const EXPERIENCE_GROUPS: Record<ExperienceGroupId, ExperienceGroup> = {
  readings: { id: 'readings', label: 'Readings', purpose: 'a deeper look at their question' },
  rituals: { id: 'rituals', label: 'Rituals', purpose: 'something they can do themselves to feel better' },
  products: { id: 'products', label: 'Products', purpose: 'a physical item to wear or keep' },
  timing: { id: 'timing', label: 'Timing', purpose: 'when to act' },
  learn: { id: 'learn', label: 'Learn', purpose: 'something to read' },
  offers: { id: 'offers', label: 'Offers', purpose: 'a discount, only alongside another card' },
};
