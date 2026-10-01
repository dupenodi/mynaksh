import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

import { colors } from '../../theme/colors';

// Centre of each house in a North Indian chart, as fractions of the square.
// House 1 is the top diamond; houses run counter-clockwise.
const HOUSE_CENTRES: [number, number][] = [
  [0.5, 0.26], [0.25, 0.11], [0.11, 0.25], [0.26, 0.5],
  [0.11, 0.75], [0.25, 0.89], [0.5, 0.74], [0.75, 0.89],
  [0.89, 0.75], [0.74, 0.5], [0.89, 0.25], [0.75, 0.11],
];

type Props = {
  size: number;
  firstSign: number | null;
  firstHousePlanets?: string[];
  tone?: 'light' | 'dark';
};

/** The classic North Indian diamond chart, drawn with a handful of SVG lines. */
export function KundliChart({ size, firstSign, firstHousePlanets = [], tone = 'light' }: Props) {
  // 'dark' is kept for callers that place the chart on an ink background.
  const stroke = tone === 'dark' ? colors.background : colors.text;
  const ink = tone === 'dark' ? colors.background : colors.muted;
  const s = size;
  const fontSize = Math.max(7, s * 0.075);

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Rect x={0.5} y={0.5} width={s - 1} height={s - 1} rx={4} stroke={stroke} strokeWidth={1.2} fill="none" />
      <Line x1={0} y1={0} x2={s} y2={s} stroke={stroke} strokeWidth={0.8} />
      <Line x1={s} y1={0} x2={0} y2={s} stroke={stroke} strokeWidth={0.8} />
      <Line x1={s / 2} y1={0} x2={s} y2={s / 2} stroke={stroke} strokeWidth={0.8} />
      <Line x1={s} y1={s / 2} x2={s / 2} y2={s} stroke={stroke} strokeWidth={0.8} />
      <Line x1={s / 2} y1={s} x2={0} y2={s / 2} stroke={stroke} strokeWidth={0.8} />
      <Line x1={0} y1={s / 2} x2={s / 2} y2={0} stroke={stroke} strokeWidth={0.8} />

      {firstSign
        ? HOUSE_CENTRES.map(([x, y], house) => (
            <SvgText
              key={house}
              x={x * s}
              y={y * s + fontSize / 3}
              fontSize={fontSize}
              fill={house === 0 ? stroke : ink}
              opacity={house === 0 ? 1 : 0.55}
              fontWeight={house === 0 ? '700' : '400'}
              textAnchor="middle"
            >
              {((firstSign - 1 + house) % 12) + 1}
            </SvgText>
          ))
        : null}

      {firstHousePlanets.map((planet, index) => (
        <SvgText
          key={planet}
          x={0.5 * s}
          y={0.26 * s + fontSize * (1.5 + index * 1.2)}
          fontSize={fontSize * 1.05}
          fill={stroke}
          fontWeight="700"
          textAnchor="middle"
        >
          {planet}
        </SvgText>
      ))}
    </Svg>
  );
}
