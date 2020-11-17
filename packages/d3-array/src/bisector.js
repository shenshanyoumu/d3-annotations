import ascending from "./ascending";

/**
 * 数组二分器，属于二分排序器的扩展。即当x不在给定数组中时，会返回
 * x最接近的两个数字之一
 * @param {*} compare 排序子函数
 */
export default function(compare) {
  /** 将单参数函数转换为升序排序子函数，注意下面赋值语句中
   *  两个compare指向不同的引用，其中参数compare函数依然接受单参数
   *  用于将数值进行转换
   */
  if (compare.length === 1) {
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

/**
 * d3的实现偏重于函数式编程思想
 * @param {*} f 在范畴论属于函子，表示两个集合的映射关系
 */
function ascendingComparator(f) {
  return function(d, x) {
    return ascending(f(d), x);
  };
}
