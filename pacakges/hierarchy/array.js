export var slice = Array.prototype.slice;

// 数组元素混淆算法，也称为洗牌算法
export function shuffle(array) {
  var m = array.length,
    t,
    i;

  while (m) {
    i = (Math.random() * m--) | 0;
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
