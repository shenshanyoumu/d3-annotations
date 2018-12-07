import none from "./none";

// 根据序列中所有值的和来决定堆叠图顺序，因此值最小的series在堆叠图底层

/**
 *
 * @param {*} series 参数形式形如[[[,A1],[,A2],[,A3]],[[,B1],[,B2],[,B3]]]
 */
export default function(series) {
  var sums = series.map(sum);

  // 先进行默认堆叠，然后排序
  return none(series).sort(function(a, b) {
    return sums[a] - sums[b];
  });
}

export function sum(series) {
  var s = 0,
    i = -1,
    n = series.length,
    v;
  while (++i < n) {
    if ((v = +series[i][1])) {
      s += v;
    }
  }
  return s;
}
