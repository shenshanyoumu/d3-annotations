import exponent from "./exponent";

// 根据给定的参数计算数字格式化后保留的精度
// 比如step = 0.05，则返回2。表示包括2位精度
export default function(step) {
  return Math.max(0, -exponent(Math.abs(step)));
}
