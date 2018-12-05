import exponent from "./exponent";

/**
 * 返回格式化后的有效位数，注意有效位数的定义是从左边第一位不是“0”开始数
 * @param {*} step 格式化数字的四舍五入精度，比如0.01
 * @param {*} max 进行格式化的最大数字，比如1.01
 */
export default function(step, max) {
  (step = Math.abs(step)), (max = Math.abs(max) - step);
  return Math.max(0, exponent(max) - exponent(step)) + 1;
}
