import type { ReactElement } from 'react';

import type { Kundli } from '../domain/kundli';
import type { WidgetKind, WidgetOf } from './definitions';

/** Everything a widget may need from the conversation around it. */
export type WidgetContext = {
  /** Under the newest message. Suggestions under older messages answer a question that has moved on. */
  isLatest: boolean;
  kundli: Kundli | null;
  savedKundli: Kundli | null;
  personaName: string;
  onQuickReply: (text: string) => void;
  onSubmitKundli: (kundli: Kundli) => void;
  onEditKundli: () => void;
};

export type WidgetProps<K extends WidgetKind> = {
  widget: WidgetOf<K>;
  context: WidgetContext;
};

export type WidgetComponent<K extends WidgetKind> = (props: WidgetProps<K>) => ReactElement | null;
