/**
 * 将普通数组映射为配对数组
 * @param {*} array 
 * @param {*} f 
 */
export default function(array, f) {
  /** 如果外部没有传递配对函数，则使用默认的配对函数 */
  if (f == null) f = pair;

  var i = 0, n = array.length - 1,
   p = array[0], pairs = new Array(n < 0 ? 0 : n);

  /** 将普通数组转换为配对数组的逻辑 */
  while (i < n) pairs[i] = f(p, p = array[++i]);


  return pairs;
}

/** 默认的配对算子，在不同场景下可以实现多种配对算法 */
export function pair(a, b) {
  return [a, b];
}
