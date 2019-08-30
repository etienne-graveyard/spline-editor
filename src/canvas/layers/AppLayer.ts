import { h } from '../core';
import { ClearLayer } from './ClearLayer';
import { Layer } from '../core/types';
import { Store } from '../../store';
import range from '../../utils/range';
import { PolylineLayer } from './PolylineLayer';
import { CState } from '../index';
import { scaleUp } from '../common';
import { bezier } from '../../utils/bezier';

const bez = bezier(0, 0, 0, 1);

export const AppLayer: Layer<{ store: Store; canvasState: CState }> = (ctx, {}, { width, height }) => {
  // const state = store.getState();

  // const spline = createSpline(state);

  const splinePoints = range(100)
    .map(i => i / 99)
    .map(x => ({ x, y: bez(x) }))
    .map(p => scaleUp(width, height, p));

  return [
    h(ClearLayer, {}),
    ctx.lineWidth(1),
    ctx.strokeStyle('rgba(0, 0, 0, 0.3)'),
    h(PolylineLayer, { line: [scaleUp(width, height, { x: 0, y: 0 }), scaleUp(width, height, { x: 0, y: 1 })] }),
    h(PolylineLayer, { line: [scaleUp(width, height, { x: 0, y: 0 }), scaleUp(width, height, { x: 1, y: 0 })] }),
    ctx.lineWidth(2),
    ctx.strokeStyle('#2196F3'),
    h(PolylineLayer, { line: splinePoints }),
    // ...state.map((point, index) => {
    //   const hovered = !!(
    //     canvasState.hovered &&
    //     canvasState.hovered.type === 'point' &&
    //     canvasState.hovered.index === index
    //   );
    //   const handleHovered = !!(
    //     canvasState.hovered &&
    //     canvasState.hovered.type === 'handle' &&
    //     canvasState.hovered.index === index
    //   );
    //   return h(PointLayer, { point: scaleUp(width, height, point), hovered, handleHovered });
    // }),
  ];
};
