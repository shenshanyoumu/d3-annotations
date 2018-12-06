var pi = Math.PI,
  halfPi = pi / 2;

// 参数为归一化的时间值，返回值表示在特定时刻的变化速率
export function sinIn(t) {
  return 1 - Math.cos(t * halfPi);
}

export function sinOut(t) {
  return Math.sin(t * halfPi);
}

export function sinInOut(t) {
  return (1 - Math.cos(pi * t)) / 2;
}
