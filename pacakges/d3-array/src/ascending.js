/** 排序仿函数，注意下面三目运算的优先级 */
export default function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
