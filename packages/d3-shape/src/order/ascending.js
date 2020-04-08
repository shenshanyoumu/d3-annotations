import none from "./none.js";

// 直方图中按照bin从高到低进行索引。
export default function(series) {
  var sums = series.map(sum);
  return none(series).sort(function(a, b) { 
    return sums[a] - sums[b];
   });
}

// series[i]用于渲染成直方图bin的一个矩形框，series[i][1]指示最终矩形框的高度
// 因此下面代码功能时，计算直方图中某个bin的高度
export function sum(series) {
  var s = 0, i = -1, n = series.length, v;
  while (++i < n) {
    if (v = +series[i][1]) s += v;
  }
  return s;
}
