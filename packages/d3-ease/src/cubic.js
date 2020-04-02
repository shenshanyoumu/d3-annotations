export function cubicIn(t) {
  return t * t * t;
}

// 时间参数t应该不从0开始，渐出效果趋近于0
export function cubicOut(t) {
  return --t * t * t + 1;
}

export function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
