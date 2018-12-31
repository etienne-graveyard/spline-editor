import { Layer } from '../core/types';
import { Polyline } from '../../utils/geometry';

export const PolylineLayer: Layer<{ line: Polyline }> = (ctx, { line }) => {
  if (line.length < 2) {
    return [];
  }
  return [
    ctx.beginPath(),
    ctx.moveTo(line[0].x, line[0].y),
    ...line.map(p => {
      return ctx.lineTo(p.x, p.y);
    }),
    ctx.stroke(),
  ];
};
