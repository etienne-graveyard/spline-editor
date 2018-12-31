function createMash() {
  var n = 0xefc8249d;

  return function(data: any) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };
}

function createRandom(...args: any[]) {
  // Johannes Baagøe <baagoe@baagoe.com>, 2010
  let s0 = 0;
  let s1 = 0;
  let s2 = 0;
  let c = 1;

  if (args.length == 0) {
    args = [+new Date()];
  }
  const mash = createMash();
  s0 = mash(' ');
  s1 = mash(' ');
  s2 = mash(' ');

  for (var i = 0; i < args.length; i++) {
    s0 -= mash(args[i]);
    if (s0 < 0) {
      s0 += 1;
    }
    s1 -= mash(args[i]);
    if (s1 < 0) {
      s1 += 1;
    }
    s2 -= mash(args[i]);
    if (s2 < 0) {
      s2 += 1;
    }
  }

  const random = function() {
    var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
    s0 = s1;
    s1 = s2;
    return (s2 = t - (c = t | 0));
  };

  random.uint32 = () => {
    return random() * 0x100000000; // 2^32
  };

  random.fract53 = () => {
    return random() + ((random() * 0x200000) | 0) * 1.1102230246251565e-16; // 2^-53
  };

  random.range = (min: number, max?: number) => {
    if (max === undefined) {
      max = min;
      min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Expected all arguments to be numbers');
    }

    return random() * (max - min) + min;
  };

  random.rangeFloor = (min: number, max?: number) => {
    if (max === undefined) {
      max = min;
      min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Expected all arguments to be numbers');
    }

    return Math.floor(random.range(min, max));
  };

  random.createRandom = createRandom;

  random.args = args;

  return random;
}

export default createRandom();
