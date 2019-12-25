import min from "./min";

/**
 * 矩阵转置
 * @param {*} matrix 采用二维数组形式表示
 */
export default function(matrix) {
  /** n表示组成矩阵的向量数量；m表示向量集维度最小的向量长度 */
  if (!(n = matrix.length)) return [];
  for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
    for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
      row[j] = matrix[j][i];
    }
  }
  return transpose;
}

/** min函数第二个参数valueof函子 */
function length(d) {
  return d.length;
}
