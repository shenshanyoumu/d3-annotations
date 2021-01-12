// 参数t范围[0,1]，
// Math.sqrt函数的导数决定了因变量与自变量的速率关系
export function circleIn(t) {
  return 1 - Math.sqrt(1 - t * t);
}

export function circleOut(t) {
  return Math.sqrt(1 - --t * t);
}

export function circleInOut(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) :
     Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
