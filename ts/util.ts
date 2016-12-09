export function delay(ms: number) {
  return new Promise<void>(k => setTimeout(k, ms));
}

export function randColor() {
  function u8() {
    return Math.floor(Math.random() * 256);
  }
  return `rgb(${u8()},${u8()},${u8()})`;
}

export interface Range {
  from: number;
  to: number;
}

export function randRange(r: Range): number {
  return (Math.random() * (r.to - r.from)) + r.from;
}

export function swapAndPop<A>(xs: A[], i: number): A {
  const last = xs.length - 1;
  if (i === xs.length - 1) {
    return xs.pop();
  } else {
    const t = xs[i];
    xs[i] = xs.pop();
    return t;
  }
}
