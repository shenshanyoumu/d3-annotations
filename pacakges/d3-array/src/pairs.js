/**
 * 
 * @param {*} array 
 * @param {*} f 
 */
export default function(array, f) {
  if (f == null) f = pair;
  var i = 0, n = array.length - 1, p = array[0], pairs = new Array(n < 0 ? 0 : n);

  /** 下面的pair算法来reduce操作数组元素 */
  while (i < n) pairs[i] = f(p, p = array[++i]);
  return pairs;
}

/** 默认的pair算子 */
export function pair(a, b) {
  return [a, b];
}
