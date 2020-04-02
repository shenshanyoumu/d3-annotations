var pi = Math.PI,
    halfPi = pi / 2;

// t>0,并且当返回值为1时，则整个渐入效果完成
export function sinIn(t) {
  return 1 - Math.cos(t * halfPi);
}


export function sinOut(t) {
  return Math.sin(t * halfPi);
}


export function sinInOut(t) {
  return (1 - Math.cos(pi * t)) / 2;
}
