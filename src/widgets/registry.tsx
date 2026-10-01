import type { ReplyWidget } from '../domain/message';
import { AnalysisWidget } from './components/AnalysisWidget';
import { KundliFormWidget } from './components/KundliFormWidget';
import { PanchangWidget } from './components/PanchangWidget';
import { QuickRepliesWidget } from './components/QuickRepliesWidget';
import { SummaryWidget } from './components/SummaryWidget';
import { TarotWidget } from './components/TarotWidget';
import type { WidgetKind, WidgetOf } from './definitions';
import type { WidgetComponent, WidgetContext } from './types';

// Keyed by kind and typed exhaustively, so a new widget kind without a component fails to compile.
const components: { [K in WidgetKind]: WidgetComponent<K> } = {
  kundli_form: KundliFormWidget,
  quick_replies: QuickRepliesWidget,
  analysis: AnalysisWidget,
  tarot: TarotWidget,
  panchang: PanchangWidget,
  summary: SummaryWidget,
};

// TypeScript cannot tie widget.kind to the matching component's props, so the lookup is narrowed once here.
function renderWidget<K extends WidgetKind>(widget: WidgetOf<K>, context: WidgetContext) {
  const Component = components[widget.kind] as WidgetComponent<K>;
  return <Component key={widget.kind} widget={widget} context={context} />;
}

export function WidgetList({ widgets, context }: { widgets: ReplyWidget[]; context: WidgetContext }) {
  return <>{widgets.map((widget) => renderWidget(widget, context))}</>;
}
