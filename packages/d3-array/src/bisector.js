import ascending from "./ascending";

/**
 *  数组的二等分操作
 * @param {*} compare compare函数接受单参数
 */
export default function(compare) {
  if (compare.length === 1) {
    /** 注意下面compare函数作为参数传递进ascendingComparator函数后，作为闭包保留；然后compare被重新赋值 */
    compare = ascendingComparator(compare);
  }

  return {
    /** 
     * a表示待二分的数组
     * x表示pivot点
     */
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        /** 注意加法运算符优先级大于算术移位运算符 */
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
}

function ascendingComparator(f) {
  return function(d, x) {
    return ascending(f(d), x);
  };
}
