var pi = Math.PI,
    halfPi = pi / 2;

// t>0,并且当返回值为1时，则整个渐入效果完成
export function sinIn(t) {
  return 1 - Math.cos(t * halfPi);
}


export function sinOut(t) {
  return Math.sin(t * halfPi);
}

// 当t取值区间[0,1]值逐渐变大，而在[1,2]区间则值逐渐变小
export function sinInOut(t) {
  return (1 - Math.cos(pi * t)) / 2;
}
