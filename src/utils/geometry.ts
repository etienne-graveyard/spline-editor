import { HALF_PI } from './math';
import range from './range';

export type Point = {
  x: number;
  y: number;
};

export type BezierPoint = Point & {
  c1: Point;
  c2: Point;
};

export type Line = [Point, Point];

export type PointWeight = Point & { weight: number };

export type PolylineWeight = Array<PointWeight>;

export type Polyline = Array<Point>;

export type Polygon = Array<Point>;

export function findLineAngle(point1: Point, point2: Point) {
  const diffPoint = {
    x: point2.x - point1.x,
    y: point2.y - point1.y,
  };
  const angle = Math.atan2(diffPoint.y, diffPoint.x);
  return angle;
}

/*
 *      /
 *     /    /
 *    /    /
 *   /    /
 *       /
 */
export function translateLineByDistance(distance: number, line: Line) {
  const angle = findLineAngle(line[0], line[1]) + Math.PI / 2;
  return [translateDistanceAtAngle(angle, distance, line[0]), translateDistanceAtAngle(angle, distance, line[1])];
}

export function translateDistanceAtAngle(angle: number, distance: number, point: Point): Point {
  const translateX = Math.cos(angle) * distance;
  const translateY = Math.sin(angle) * distance;
  const newPoint = {
    x: point.x + translateX,
    y: point.y + translateY,
  };
  return newPoint;
}

export function translatePointFromLineAtAngle(point: Point, ref: Point, angle: number, distance: number): Point {
  const lineAngle = findLineAngle(point, ref);
  return translateDistanceAtAngle(lineAngle - angle, distance, point);
}

export function lineIntersect(l1: Line, l2: Line): Point {
  var P1 = l1[0],
    P2 = l1[1],
    P3 = l2[0],
    P4 = l2[1];

  var x =
    ((P1.x * P2.y - P2.x * P1.y) * (P3.x - P4.x) - (P1.x - P2.x) * (P3.x * P4.y - P3.y * P4.x)) /
    ((P1.x - P2.x) * (P3.y - P4.y) - (P1.y - P2.y) * (P3.x - P4.x));
  var y =
    ((P1.x * P2.y - P2.x * P1.y) * (P3.y - P4.y) - (P1.y - P2.y) * (P3.x * P4.y - P3.y * P4.x)) /
    ((P1.x - P2.x) * (P3.y - P4.y) - (P1.y - P2.y) * (P3.x - P4.x));
  return { x, y };
}

export function polylineWeightToPolygone(poly: PolylineWeight): Polygon {
  if (poly.length < 2) {
    throw new Error('Too short');
  }
  const start: Array<Point> = [];
  const end: Array<Point> = [];

  poly.forEach((p, i, arr) => {
    if (i === 0) {
      const other = arr[1];
      start.push(translatePointFromLineAtAngle(p, other, -HALF_PI, p.weight));
      end.push(translatePointFromLineAtAngle(p, other, HALF_PI, p.weight));
      return;
    }
    if (i === arr.length - 1) {
      const other = arr[i - 1];
      start.push(translatePointFromLineAtAngle(p, other, HALF_PI, p.weight));
      end.push(translatePointFromLineAtAngle(p, other, -HALF_PI, p.weight));
      return;
    }
    const prev = arr[i - 1];
    const next = arr[i + 1];
    const l1a = translatePointFromLineAtAngle(prev, p, -HALF_PI, prev.weight);
    const l1b = translatePointFromLineAtAngle(p, prev, HALF_PI, p.weight);
    const l2a = translatePointFromLineAtAngle(p, next, -HALF_PI, p.weight);
    const l2b = translatePointFromLineAtAngle(next, p, HALF_PI, next.weight);
    const p1 = lineIntersect([l1a, l1b], [l2a, l2b]);
    const l3a = translatePointFromLineAtAngle(prev, p, HALF_PI, prev.weight);
    const l3b = translatePointFromLineAtAngle(p, prev, -HALF_PI, p.weight);
    const l4a = translatePointFromLineAtAngle(p, next, HALF_PI, p.weight);
    const l4b = translatePointFromLineAtAngle(next, p, -HALF_PI, next.weight);
    const p2 = lineIntersect([l3a, l3b], [l4a, l4b]);
    start.push(p1);
    end.push(p2);
  });

  return [...start, ...end.reverse()];
}

type ArcOptions = {
  origin: Point;
  steps: number;
  size: (index: number, prevSize: number | undefined) => number;
  angle: (index: number, prevAngle: number | undefined) => number;
};

export function createArc({ steps, origin, size, angle }: ArcOptions): Polyline {
  let prevPoint = origin;
  let nextAngle = angle(0, undefined);
  let nextSize = size(0, undefined);
  return range(steps).reduce<Polyline>(
    (acc, i) => {
      prevPoint = translateDistanceAtAngle(nextAngle, nextSize, prevPoint);
      acc.push(prevPoint);
      nextAngle = angle(i, nextAngle);
      nextSize = size(i, nextSize);
      return acc;
    },
    [origin]
  );
}

export function addWeight(
  line: Polyline,
  adder: (point: Point, index: number, size: number) => number
): PolylineWeight {
  return line.map((p, i) => {
    return {
      x: p.x,
      y: p.y,
      weight: adder(p, i, line.length),
    };
  });
}

export function distance(p1: Point, p2: Point): number {
  const xdiff = Math.abs(p1.x - p2.x);
  const ydiff = Math.abs(p1.y - p2.y);
  return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
}

export function vectorLength(point: Point): number {
  return distance({ x: 0, y: 0 }, point);
}
