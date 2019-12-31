import ascending from "./ascending";

/**
 * 数组扫描，根据compare仿函数来返回符合条件的第一个元素索引
 * @param {*} values 
 * @param {*} compare 
 */
export default function(values, compare) {
  if (!(n = values.length)) return;
  var n,
      i = 0,
      j = 0,
      xi,
      xj = values[j];

  if (compare == null) compare = ascending;

  while (++i < n) {
    /** compare(xj,xj)不为零的异常情况在于xj不能进行比较操作，比如NaN类型 */
    if (compare(xi = values[i], xj) < 0 || compare(xj, xj) !== 0) {
      xj = xi, j = i;
    }
  }

  /** 下面比较的意义在于确保values中元素具有可比较能力 */
  if (compare(xj, xj) === 0) return j;
}
