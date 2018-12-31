import { Layer } from '../core/types';
import { Polygon } from '../../utils/geometry';
import { CanvasColorType } from '../core/OperationFactory';

export const PolygoneLayer: Layer<{ polygone: Polygon; color?: CanvasColorType }> = (ctx, { polygone, color }) => {
  if (polygone.length < 2) {
    return [];
  }
  return [
    ctx.beginPath(),
    ctx.moveTo(polygone[0].x, polygone[0].y),
    ...polygone.map(p => {
      return ctx.lineTo(p.x, p.y);
    }),
    ctx.closePath(),
    ctx.fillStyle(color || 'rgba(0, 0, 0, 0.3)'),
    ctx.fill(),
  ];
};
