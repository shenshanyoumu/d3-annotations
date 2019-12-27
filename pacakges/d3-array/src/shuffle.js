/**
 * shuffle算法和permutation是不一样的，permutation基于排序索引对原数组重排
 * shuffle算法是一种朴素的采用均匀随机算法的洗牌方式，参数i0和i1表示参与随机洗牌的数组起止索引
 * @param {*} array 
 * @param {*} i0 
 * @param {*} i1 
 */
export default function(array, i0, i1) {
  /** m表示参与随机洗牌的数组区间长度 */
  var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
      t,
      i;

  /** Fisher-Yates的偏差性，一般由random函数导致 */
  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m + i0];
    array[m + i0] = array[i + i0];
    array[i + i0] = t;
  }

  return array;
}
