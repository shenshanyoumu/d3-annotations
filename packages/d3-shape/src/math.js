export var abs = Math.abs;
/** 笛卡尔坐标系中，返回从X轴正方向到给定参数point(x,y)的弧度 */
export var atan2 = Math.atan2; 
export var cos = Math.cos;
export var max = Math.max;
export var min = Math.min;
export var sin = Math.sin;
export var sqrt = Math.sqrt;

/** 精度 */
export var epsilon = 1e-12;
export var pi = Math.PI;
export var halfPi = pi / 2;

/** 整原弧度 */
export var tau = 2 * pi;

/**
 * 在数学意义上acos的参数范围为[-1,1]之间；
 * 并且cos在0的值为1，在π时为-1
 * @param {*} x 
 */
export function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}

/**
 * 同理acos。
 * @param {*} x 
 */
export function asin(x) {
  return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
}
