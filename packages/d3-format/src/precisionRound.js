import exponent from "./exponent.js";

// step表示精度，即格式化后参数与原参数的误差
// max表示能够进行四舍五入精度转换的最大数值
export default function(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent(max) - exponent(step)) + 1;
}
