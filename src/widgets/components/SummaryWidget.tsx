import { colors } from '../../theme/colors';
import type { WidgetProps } from '../types';
import { MarkedList, WidgetCard, WidgetSection } from './WidgetCard';

/** The close of a session: what was found, what was suggested, and what to do this week. */
export function SummaryWidget({ widget, context }: WidgetProps<'summary'>) {
  const { headline, insights, remedies, nextSteps } = widget.summary;
  const sections = [
    { title: 'What we found', items: insights, color: colors.faint },
    { title: 'Your remedies', items: remedies, color: colors.brand },
    { title: 'This week', items: nextSteps, color: colors.positive },
  ].filter((section) => section.items.length > 0);

  return (
    <WidgetCard eyebrow={`Session summary · ${context.personaName}`} title={headline}>
      {sections.map((section) => (
        <SummarySection key={section.title} {...section} />
      ))}
    </WidgetCard>
  );
}

function SummarySection({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <>
      <WidgetSection>{title}</WidgetSection>
      <MarkedList items={items} color={color} />
    </>
  );
}
