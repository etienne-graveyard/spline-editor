const EPSILON = Number.EPSILON;

export function clamp(value: number, min: number, max: number): number {
  return min < max ? (value < min ? min : value > max ? max : value) : value < max ? max : value > min ? min : value;
}

export function clamp01(v: number): number {
  return clamp(v, 0, 1);
}

export function lerp(min: number, max: number, t: number): number {
  return min * (1 - t) + max * t;
}

export function inverseLerp(min: number, max: number, t: number): number {
  return Math.abs(min - max) < EPSILON ? 0 : (t - min) / (max - min);
}

export const TWO_PI = Math.PI * 2;
export const HALF_PI = Math.PI / 2;

export const PI = Math.PI;
