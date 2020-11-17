/**
 * 二维数组的一维化处理
 * @param {*} arrays 表示二维数组，即arrays数组中每个元素也是数组
 */
export default function(arrays) {
  var n = arrays.length,
      m,
      i = -1,
      j = 0,
      merged,
      array;

  // 计算二维数组元素个数，并保存到变量j中
  while (++i < n) j += arrays[i].length;
  merged = new Array(j);

  /** 从下到上，从右到左依次赋值 */
  while (--n >= 0) {
    array = arrays[n];
    m = array.length;
    while (--m >= 0) {
      merged[--j] = array[m];
    }
  }

  return merged;
}
