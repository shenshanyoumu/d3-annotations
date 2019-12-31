import min from "./min";

/**
 * 矩阵转置
 * @param {*} matrix 采用二维数组形式表示
 */
export default function(matrix) {
  /** n表示组成矩阵的向量数量；m表示向量集维度最小的向量长度 */
  if (!(n = matrix.length)) return [];

  /** 在JS中两个对象指向同一个地址，则修改任意一个对象内容也会影响另一个对象 */
  /** matrix并非数学意义上的矩阵，实际上可以是二维数组，因此需要计算min(matrix,length) */
  /** 暴力的矩阵转置需要三个for循环嵌套，下面充分利用对象引用地址模式来降低时间复杂度 */
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
