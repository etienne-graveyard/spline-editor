import { OperationFactory } from './OperationFactory';

export const $$TYPE = Symbol('$$TYPE');

export enum ElementType {
  Operation = 'Operation',
  Element = 'Element',
}

export type OperationElement = {
  [$$TYPE]: ElementType.Operation;
  type: string;
  args: Array<any>;
  property: boolean;
};

export type LayerElement = {
  [$$TYPE]: ElementType.Element;
  layer: Layer<any>;
  props: any;
};

export type CanvasElement = OperationElement | LayerElement | null;

export function isOperation(elem: CanvasElement): elem is OperationElement {
  return !!elem && elem[$$TYPE] === ElementType.Operation;
}

export function isElement(elem: CanvasElement): elem is LayerElement {
  return !!elem && elem[$$TYPE] === ElementType.Element;
}

export function flattenElements<T>(n: Array<any>): T {
  return n.reduce((acc, v) => {
    if (Array.isArray(v)) {
      return acc.concat(v);
    } else {
      acc.push(v);
    }
    return acc;
  }, []);
}

export type LayerData = {
  delta: number;
  timestamp: number;
  width: number;
  height: number;
};

export type Layer<Props = {}> = (
  ctx: OperationFactory,
  props: Props,
  data: LayerData
) => CanvasElement | Array<CanvasElement>;
