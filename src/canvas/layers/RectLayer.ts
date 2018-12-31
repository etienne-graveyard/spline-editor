import { Layer } from '../core/types';

type Props = { x: number; y: number; width: number; height: number };

export const RectLayer: Layer<Props> = (ctx, { x, y, width, height }) => {
  return [ctx.fillStyle('red'), ctx.beginPath(), ctx.rect(x, y, width, height), ctx.fill()];
};
