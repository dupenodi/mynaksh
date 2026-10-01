import { createElement } from 'react';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { EARLIEST_BIRTH, todayIso } from './birthInput';

type ControlProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
};

type InputStyle = Record<string, string | number>;

function fieldStyle(filled: boolean, disabled?: boolean): InputStyle {
  return {
    width: '100%',
    height: '100%',
    minWidth: 0,
    margin: 0,
    padding: '0 12px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    boxSizing: 'border-box',
    fontFamily: fonts.body,
    fontSize: 15,
    color: disabled ? 'transparent' : filled ? colors.text : colors.faint,
    cursor: disabled ? 'default' : 'pointer',
    colorScheme: 'light',
  };
}

function BirthInput({
  type,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled,
  accessibilityLabel,
  min,
  max,
  autoComplete,
}: ControlProps & { type: 'date' | 'time'; min?: string; max?: string; autoComplete?: string }) {
  return createElement('input', {
    type,
    value,
    min,
    max,
    disabled,
    autoComplete,
    'aria-label': accessibilityLabel,
    onFocus,
    onBlur,
    onChange: (event: { target: { value: string } }) => onChange(event.target.value),
    style: fieldStyle(value.length > 0, disabled),
  });
}

export function DateControl(props: ControlProps) {
  return <BirthInput {...props} type="date" min={EARLIEST_BIRTH} max={todayIso()} autoComplete="bday" />;
}

export function TimeControl(props: ControlProps) {
  return <BirthInput {...props} type="time" value={props.disabled ? '' : props.value} autoComplete="off" />;
}
