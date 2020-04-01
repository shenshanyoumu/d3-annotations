// 二次渐入
export function quadIn(t) {
  return t * t;
}

export function quadOut(t) {
  return t * (2 - t);
}

// 二次渐入+渐出。注意对时间参数t的取值范围控制
export function quadInOut(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
