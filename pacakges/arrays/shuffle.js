// 数组元素的混淆操作，类似洗牌一样。这个函数在一些随机展示图表很有用，比如wordle词云和Packing图
export default function shuffle(array, i0 = 0, i1 = array.length) {
  var m = i1 - (i0 = +i0),
    t,
    i;

  while (m) {
    i = (Math.random() * m--) | 0;
    t = array[m + i0];
    array[m + i0] = array[i + i0];
    array[i + i0] = t;
  }

  return array;
}
