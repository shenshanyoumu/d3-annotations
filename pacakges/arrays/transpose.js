//min函数比Math.min函数进行了增强，可以接收访问器函数
import min from "./min";

// 矩阵转置操作
export default function(matrix) {
  if (!(n = matrix.length)) return [];
  for (
    var i = -1, m = min(matrix, length), transpose = new Array(m);
    ++i < m;

  ) {
    for (var j = -1, n, row = (transpose[i] = new Array(n)); ++j < n; ) {
      row[j] = matrix[j][i];
    }
  }
  return transpose;
}

// 计算类数组参数的元素长度函数
function length(d) {
  return d.length;
}
