import type { ReplyWidget } from '../domain/message';
import { analysis } from './kinds/analysis';
import { kundliForm } from './kinds/kundliForm';
import { panchang } from './kinds/panchang';
import { quickReplies } from './kinds/quickReplies';
import { summary } from './kinds/summary';
import { tarot } from './kinds/tarot';
import type { ReplyUi, WidgetDefinition, WidgetKind, WidgetOf } from './kinds/types';

export type { ReplyUi, WidgetKind, WidgetOf } from './kinds/types';

/**
 * Interactive UI the astrologer can put under a reply, besides cards. One file per kind in kinds/.
 * To add a widget: add it to ReplyWidget, write its definition, list it here, and give it a
 * component in widgets/registry.tsx. The compiler flags any step you miss.
 */
const definitions: { [K in WidgetKind]: WidgetDefinition<K> } = {
  kundli_form: kundliForm,
  analysis,
  tarot,
  panchang,
  summary,
  // Last, so suggestions sit under everything else.
  quick_replies: quickReplies,
};

const kinds = Object.keys(definitions) as WidgetKind[];

export function parseWidgets(ui: ReplyUi): ReplyWidget[] {
  return kinds.map((kind) => definitions[kind].parse(ui)).filter((widget) => widget !== undefined);
}

// TypeScript cannot tie widget.kind to the matching definition, so the lookup is narrowed once here.
function encodeWidget<K extends WidgetKind>(widget: WidgetOf<K>): ReplyUi {
  return (definitions[widget.kind] as WidgetDefinition<K>).encode(widget);
}

/** The UI object for a set of widgets: the inverse of parseWidgets. */
export function encodeWidgets(widgets: ReplyWidget[]): ReplyUi {
  return Object.assign({}, ...widgets.map((widget) => encodeWidget(widget)));
}

export function widgetPromptLines(): string[] {
  return kinds.map((kind) => definitions[kind].prompt);
}
