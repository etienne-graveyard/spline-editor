import { Point } from '../utils/geometry';
import { Op, Ops, createOp, reverseOp, applyOp } from './core/op';

const margin = 0.1;

const horizontal = (width: number): Op =>
  createOp(val =>
    Ops.add(
      Ops.multiply(width, margin),
      Ops.multiply(val, Ops.multiply(width, Ops.substract(1, Ops.multiply(margin, 2))))
    )
  );

const vertical = (height: number): Op =>
  createOp(val =>
    Ops.substract(
      height,
      Ops.add(
        Ops.multiply(height, margin),
        Ops.multiply(val, Ops.multiply(height, Ops.substract(1, Ops.multiply(margin, 2))))
      )
    )
  );

console.log(reverseOp(vertical(1000)));

export function scaleUp<P extends Point>(width: number, height: number, point: P): P {
  return {
    ...point,
    x: applyOp(horizontal(width), point.x),
    y: applyOp(vertical(height), point.y),
  };
}

export function scaleDown<P extends Point>(width: number, height: number, point: P): P {
  return {
    ...point,
    x: applyOp(reverseOp(horizontal(width)), point.x),
    y: applyOp(reverseOp(vertical(height)), point.y),
  };
}
