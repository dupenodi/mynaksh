import type { KnownRecommendationType } from '../catalog';
import { ConsultationDetail } from './ConsultationDetail';
import { GenericDetail } from './GenericDetail';
import { MantraDetail } from './MantraDetail';
import { MuhuratDetail } from './MuhuratDetail';
import { StepsDetail } from './StepsDetail';
import type { DetailComponent } from './types';

export type { DetailActions } from './types';

/** Types with their own detail view. Everything else, including unknown types, uses the generic one. */
const details: Partial<Record<KnownRecommendationType, DetailComponent>> = {
  consultation: ConsultationDetail,
  mantra: MantraDetail,
  remedy: StepsDetail,
  meditation: StepsDetail,
  muhurat: MuhuratDetail,
};

export function detailFor(type: string): DetailComponent {
  return details[type as KnownRecommendationType] ?? GenericDetail;
}
