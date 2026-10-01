import type { Recommendation } from '../../domain/recommendation';
import { getExperience } from '../../recommendations/catalog';
import { detailFor, type DetailActions } from '../../recommendations/details';
import { Sheet } from '../Sheet';

type Props = {
  recommendation: Recommendation | null;
  actions: DetailActions;
};

/** A card's detail view in a bottom sheet. Each type picks its own view from the details registry. */
export function RecommendationSheet({ recommendation, actions }: Props) {
  const Detail = recommendation ? detailFor(recommendation.type) : null;

  return (
    <Sheet visible={recommendation !== null} onClose={actions.close}>
      {recommendation && Detail ? (
        <Detail key={recommendation.id} recommendation={recommendation} look={getExperience(recommendation.type)} actions={actions} />
      ) : null}
    </Sheet>
  );
}
