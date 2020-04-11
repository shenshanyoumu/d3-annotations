export var slice = Array.prototype.slice;

export function shuffle(array) {
  var m = array.length,
      t,
      i;

  // 随机洗牌，注意下面从数组最后一位进行元素的随机替换
  // 这是一种服从均匀分布的随机，并且保证每一个元素只会被交换一次
  // 其实针对概率独立性而言，交换一次和交换N的数学意义是一样的
  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
