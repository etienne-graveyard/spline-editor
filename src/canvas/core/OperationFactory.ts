import { OperationElement, $$TYPE, ElementType } from './types';

export type CanvasColorType = string | CanvasGradient | CanvasPattern;

export interface OperationFactory extends CanvasRect {
  restore(): OperationElement;
  save(): OperationElement;
  resetTransform(): OperationElement;
  rotate(angle: number): OperationElement;
  scale(x: number, y: number): OperationElement;
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): OperationElement;
  setTransform(transform?: DOMMatrix2DInit): OperationElement;
  transform(a: number, b: number, c: number, d: number, e: number, f: number): OperationElement;
  translate(x: number, y: number): OperationElement;
  clearRect(x: number, y: number, w: number, h: number): OperationElement;
  fillRect(x: number, y: number, w: number, h: number): OperationElement;
  strokeRect(x: number, y: number, w: number, h: number): OperationElement;

  beginPath(): OperationElement;
  clip(fillRule?: CanvasFillRule): OperationElement;
  clip(path: Path2D, fillRule?: CanvasFillRule): OperationElement;
  fill(fillRule?: CanvasFillRule): OperationElement;
  fill(path: Path2D, fillRule?: CanvasFillRule): OperationElement;
  stroke(): OperationElement;
  stroke(path: Path2D): OperationElement;

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ): OperationElement;
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): OperationElement;
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): OperationElement;
  closePath(): OperationElement;
  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ): OperationElement;
  lineTo(x: number, y: number): OperationElement;
  moveTo(x: number, y: number): OperationElement;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): OperationElement;
  rect(x: number, y: number, w: number, h: number): OperationElement;

  fillStyle(val: CanvasColorType): OperationElement;
  strokeStyle(val: CanvasColorType): OperationElement;
  lineCap(val: CanvasLineCap): OperationElement;
  lineDashOffset(val: number): OperationElement;
  lineJoin(val: CanvasLineJoin): OperationElement;
  lineWidth(val: number): OperationElement;
}

export function createOperationFactory(): OperationFactory {
  const factory = {} as any;
  const methods = [
    'restore',
    'save',
    'resetTransform',
    'rotate',
    'scale',
    'setTransform',
    'setTransform',
    'transform',
    'translate',
    'clearRect',
    'fillRect',
    'strokeRect',
    'beginPath',
    'clip',
    'clip',
    'fill',
    'fill',
    'stroke',
    'stroke',
    'arc',
    'arcTo',
    'bezierCurveTo',
    'closePath',
    'ellipse',
    'lineTo',
    'moveTo',
    'quadraticCurveTo',
    'rect',
  ];

  methods.forEach(name => {
    factory[name] = (...args: Array<any>): OperationElement => ({
      [$$TYPE]: ElementType.Operation,
      type: name,
      args,
      property: false,
    });
  });

  const properties = ['fillStyle', 'strokeStyle', 'lineCap', 'lineDashOffset', 'lineJoin', 'lineWidth'];
  properties.forEach(name => {
    factory[name] = (...args: Array<any>): OperationElement => ({
      [$$TYPE]: ElementType.Operation,
      type: name,
      args,
      property: true,
    });
  });
  return factory;
}
