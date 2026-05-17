import React from 'react';
import Svg, { Path, Ellipse } from 'react-native-svg';

// A pie chart drawn with a three-dimensional look: a squashed (perspective)
// top face with an extruded side wall beneath it.

function darken(hex, factor = 0.6) {
  const h = hex.replace('#', '');
  const r = Math.round(parseInt(h.slice(0, 2), 16) * factor);
  const g = Math.round(parseInt(h.slice(2, 4), 16) * factor);
  const b = Math.round(parseInt(h.slice(4, 6), 16) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

function point(cx, cy, rx, ry, angle) {
  return [cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)];
}

export default function Pie3D({ data, width = 280 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total <= 0) return null;

  const rx = width * 0.34;
  const ry = rx * 0.56;
  const depth = rx * 0.34;
  const cx = width / 2;
  const cy = ry + 10;
  const height = ry * 2 + depth + 20;

  if (data.length === 1) {
    const c = data[0].color;
    return (
      <Svg width={width} height={height}>
        <Path
          d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy} L ${cx + rx} ${cy + depth} A ${rx} ${ry} 0 0 0 ${cx - rx} ${cy + depth} Z`}
          fill={darken(c)}
        />
        <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={c} />
      </Svg>
    );
  }

  let angle = -Math.PI / 2;
  const slices = data.map((d) => {
    const fraction = d.value / total;
    const a0 = angle;
    const a1 = angle + fraction * Math.PI * 2;
    angle = a1;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const [x0, y0] = point(cx, cy, rx, ry, a0);
    const [x1, y1] = point(cx, cy, rx, ry, a1);
    return { ...d, x0, y0, x1, y1, large };
  });

  return (
    <Svg width={width} height={height}>
      {slices.map((s, i) => (
        <Path
          key={`wall-${i}`}
          d={`M ${s.x0} ${s.y0} A ${rx} ${ry} 0 ${s.large} 1 ${s.x1} ${s.y1} L ${s.x1} ${s.y1 + depth} A ${rx} ${ry} 0 ${s.large} 0 ${s.x0} ${s.y0 + depth} Z`}
          fill={darken(s.color)}
        />
      ))}
      {slices.map((s, i) => (
        <Path
          key={`top-${i}`}
          d={`M ${cx} ${cy} L ${s.x0} ${s.y0} A ${rx} ${ry} 0 ${s.large} 1 ${s.x1} ${s.y1} Z`}
          fill={s.color}
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />
      ))}
    </Svg>
  );
}
