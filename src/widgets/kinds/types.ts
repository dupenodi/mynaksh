import type { ReplyWidget } from '../../domain/message';

export type WidgetKind = ReplyWidget['kind'];
export type WidgetOf<K extends WidgetKind> = Extract<ReplyWidget, { kind: K }>;

/** The UI object a reply carries after the marker, e.g. {"form":"kundli","replies":[…]}. */
export type ReplyUi = Record<string, unknown>;

export type WidgetDefinition<K extends WidgetKind> = {
  /** Reads this widget from the reply's UI object. Undefined when it is absent or malformed. */
  parse: (ui: ReplyUi) => WidgetOf<K> | undefined;
  /** The inverse of parse: the UI keys this widget came from, so a past reply can be shown to the model as it was written. */
  encode: (widget: WidgetOf<K>) => ReplyUi;
  /** One line for the live prompt explaining the key, its shape and when to use it. */
  prompt: string;
};
