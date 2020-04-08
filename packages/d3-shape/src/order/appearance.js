import none from "./none.js";

// 根据上下文可知，series应该是二维数组
export default function(series) {
  var peaks = series.map(peak);
  
  // 下面含义具体场景-在堆叠直方图中，按照直方图bin中最高矩形框进行从大到小排序
  // 注意：直方图每个bin由一系列堆叠起来的矩形组成
  return none(series).sort(function(a, b) {
     return peaks[a] - peaks[b];
     });
}

// 找到数组中关键字最大的索引，真实的业务场景即找到直方图某个bin中最高的矩形
function peak(series) {
  var i = -1, j = 0, n = series.length, vi, vj = -Infinity;
  while (++i < n)
     if ((vi = +series[i][1]) > vj) {
      vj = vi, j = i;
     }
  return j;
}
