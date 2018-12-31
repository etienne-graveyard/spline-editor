enum OpType {
  Add = 'Add',
  Multiply = 'Multiply',
  Divide = 'Divide',
}

const OP_VALUE = Symbol('OP_VALUE');

export type Op = {
  type: OpType;
  x: OpCompat;
  y: OpCompat;
};

export type OpCompat = number | Op | typeof OP_VALUE;

export const Ops = {
  add: (x: OpCompat, y: OpCompat): Op => ({
    type: OpType.Add,
    x,
    y,
  }),
  multiply: (x: OpCompat, y: OpCompat): Op => ({
    type: OpType.Multiply,
    x,
    y,
  }),
  substract: (x: OpCompat, y: OpCompat): Op => ({
    type: OpType.Add,
    x,
    y: {
      type: OpType.Multiply,
      x: y,
      y: -1,
    },
  }),
  divide: (x: OpCompat, y: OpCompat): Op => ({
    type: OpType.Divide,
    x,
    y,
  }),
};

function containValue(ope: OpCompat): boolean {
  if (typeof ope === 'number') {
    return false;
  }
  if (ope === OP_VALUE) {
    return true;
  }
  return containValue(ope.x) || containValue(ope.y);
}

export function reverseOp(ope: Op): OpCompat {
  let left: OpCompat = OP_VALUE;
  let right: OpCompat = ope;
  let limit = 1000;
  while (limit > 0) {
    limit--;
    if (typeof right === 'number') {
      throw new Error('What ??');
    }
    if (typeof right === 'symbol' && right === OP_VALUE) {
      break;
    }
    if (containValue(right.x) && containValue(right.y)) {
      throw new Error('Not supported yet');
    }
    if (containValue(right.x)) {
      if (right.type === OpType.Add) {
        left = {
          type: OpType.Add,
          x: left,
          y: Ops.multiply(right.y, -1),
        };
      } else if (right.type === OpType.Multiply) {
        left = {
          type: OpType.Divide,
          x: left,
          y: right.y,
        };
      } else if (right.type === OpType.Divide) {
        left = {
          type: OpType.Multiply,
          x: left,
          y: right.y,
        };
      }
      right = right.x;
    } else if (containValue(right.y)) {
      if (right.type === OpType.Add) {
        left = {
          type: OpType.Add,
          x: left,
          y: Ops.multiply(right.x, -1),
        };
      } else if (right.type === OpType.Multiply) {
        left = {
          type: OpType.Divide,
          x: left,
          y: right.y,
        };
      } else if (right.type === OpType.Divide) {
        left = {
          type: OpType.Multiply,
          x: left,
          y: right.y,
        };
      }
      right = right.y;
    } else {
      console.log(right);
      throw new Error('Whaaat ??');
    }
  }
  if (limit === 0) {
    throw new Error('Hit limit');
  }
  return left;
}

export function createOp(creator: (val: typeof OP_VALUE) => Op): Op {
  return creator(OP_VALUE);
}

export function applyOp(ope: OpCompat, value: number): number {
  if (typeof ope === 'number') {
    return ope;
  }
  if (ope === OP_VALUE) {
    return value;
  }
  switch (ope.type) {
    case OpType.Add:
      return applyOp(ope.x, value) + applyOp(ope.y, value);
    case OpType.Multiply:
      return applyOp(ope.x, value) * applyOp(ope.y, value);
    case OpType.Divide:
      return applyOp(ope.x, value) / applyOp(ope.y, value);
  }
}
