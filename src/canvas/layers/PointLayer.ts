import { Layer } from '../core/types';
import { TWO_PI } from '../../utils/math';
import { SplinePoint } from '../../utils/curves';

export const PointLayer: Layer<{ point: SplinePoint; hovered: boolean; handleHovered: boolean }> = (
  ctx,
  { point, hovered, handleHovered },
  {}
) => {
  return [
    // point
    ctx.beginPath(),
    ctx.arc(point.x, point.y, 10, 0, TWO_PI),
    ctx.fillStyle(`rgba(214, 24, 24, ${hovered ? '0.8' : '0.4'})`),
    ctx.fill(),
    ctx.beginPath(),
    ctx.arc(point.x, point.y, 3, 0, TWO_PI),
    ctx.fillStyle('#B71C1C'),
    ctx.fill(),
    // k
    ctx.beginPath(),
    ctx.arc(point.x + 10, point.y - point.k * 50, 10, 0, TWO_PI),
    ctx.fillStyle(`rgba(239, 119, 34, ${handleHovered ? '0.8' : '0.4'})`),
    ctx.fill(),

    ctx.beginPath(),
    ctx.arc(point.x + 10, point.y - point.k * 50, 3, 0, TWO_PI),
    ctx.fillStyle('#EF6C00'),
    ctx.fill(),
  ];
};
