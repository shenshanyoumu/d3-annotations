import ascending from "./ascending";

/**
 * 根据compare函数，计算得到特定的元素索引J,使得values[j]与其他任何元素都满足compare函子
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
    /** 注意:compare(xj,xj)单独计算，是对xj为NaN或者不可比较元素的场景考虑；
     *  当values中存在两个元素满足compare函子，则暂存符合条件的元素
     */
    if (compare(xi = values[i], xj) < 0 || compare(xj, xj) !== 0) {
      xj = xi, j = i;
    }
  }

  /** 当xj为NaN或者不可比较元素，则scan函数返回undefined
   *  否则会根据上面计算过程，返回特定的元素索引。该元素与数组中其他元素符合compare运算过程
   */
  if (compare(xj, xj) === 0) return j;
}
