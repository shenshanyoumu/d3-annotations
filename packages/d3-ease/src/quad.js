// 二次渐入，可以绘制曲线直观
export function quadIn(t) {
  return t * t;
}

//在[0,1]区间和[1,2]区间的渐变方程
export function quadOut(t) {
  return t * (2 - t);
}

// 二次渐入+渐出。注意对时间参数t的取值范围控制
export function quadInOut(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
