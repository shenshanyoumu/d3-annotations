// 升序排序访问器
import ascending from "./ascending";

/**
 * 根据传递的比较器，返回一个二分函数对象
 * @param {*} compare 比较器函数
 */
export default function(compare) {
  // 当compare比较器函数只接受一个参数，则扩展为接收两个参数的比较器
  if (compare.length === 1) {
    compare = ascendingComparator(compare);
  }

  //这个增强的二分排序算法，用于返回给定元素x在数组a的最小夹逼区间
  //当left/right的返回相同值，则说明x存在与数组a中
  return {
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        // 注意下面>>>运算表示无符号右移操作
        var mid = (lo + hi) >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = (lo + hi) >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
}

//注意这个函数中，对比较访问器第一个参数进行了额外的函数处理
//而这个额外的函数f就是只接收一个参数的访问器函数
function ascendingComparator(f) {
  return function(d, x) {
    return ascending(f(d), x);
  };
}
