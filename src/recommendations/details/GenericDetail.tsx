import { DetailButtons, DetailHeading, DetailHero, DetailScroll, DetailWhy, FactList } from './DetailParts';
import type { DetailProps } from './types';

/** Types with an `ask` move the chat on instead of confirming. */
export function GenericDetail({ recommendation, look, actions }: DetailProps) {
  const onPrimary = () =>
    look.ask ? actions.ask(look.ask) : actions.confirm(`${look.cta}: ${recommendation.title}`);

  return (
    <DetailScroll>
      <DetailHero recommendation={recommendation} look={look} />
      <DetailHeading recommendation={recommendation} look={look} />
      <DetailWhy recommendation={recommendation} look={look} />
      <FactList facts={recommendation.facts} />
      <DetailButtons primary={look.cta} onPrimary={onPrimary} onClose={actions.close} />
    </DetailScroll>
  );
}
