import appearance from "./appearance.js";
import {sum} from "./ascending.js";

// series是一个二维数组，其中每一行的数值之和组成堆叠图的一个堆叠
export default function(series) {
  var n = series.length,
      i,
      j,

      // 堆叠图中每个堆叠的数值和
      sums = series.map(sum),

      // 将每个堆叠中最大值进行索引排序
      order = appearance(series),
      top = 0,
      bottom = 0,
      tops = [],
      bottoms = [];

  // 
  for (i = 0; i < n; ++i) {
    j = order[i];
    if (top < bottom) {
      top += sums[j];
      tops.push(j);
    } else {
      bottom += sums[j];
      bottoms.push(j);
    }
  }

  return bottoms.reverse().concat(tops);
}
