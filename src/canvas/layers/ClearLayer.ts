import { Layer } from '../core/types';
import { CanvasColorType } from '../core/OperationFactory';

export const ClearLayer: Layer<{ color?: CanvasColorType }> = (ctx, { color }, { height, width }) => {
  if (color) {
    return [ctx.fillStyle(color), ctx.fillRect(0, 0, width, height)];
  }
  return [ctx.clearRect(0, 0, width, height)];
};
