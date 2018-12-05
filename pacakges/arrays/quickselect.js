import ascending from "./ascending";

// Based on https://github.com/mourner/quickselect
// ISC license, Copyright 2018 Vladimir Agafonkin.

// 注意该算法与快拍的异同
// 快速选择算法用于在随机数组中选取第K大的元素
export default function quickselect(
  array,
  k,
  left = 0,
  right = array.length - 1,
  compare = ascending
) {
  while (right > left) {
    // 所谓快速，自然需要对元素的查找半径快速收敛，同时保证不能漏检。而下面的对数运算和开方运算收敛效果较好
    if (right - left > 600) {
      const n = right - left + 1;
      const m = k - left + 1;
      const z = Math.log(n);
      const s = 0.5 * Math.exp((2 * z) / 3);
      const sd =
        0.5 * Math.sqrt((z * s * (n - s)) / n) * (m - n / 2 < 0 ? -1 : 1);
      const newLeft = Math.max(left, Math.floor(k - (m * s) / n + sd));
      const newRight = Math.min(right, Math.floor(k + ((n - m) * s) / n + sd));
      quickselect(array, k, newLeft, newRight, compare);
    }

    // array[k]相当于快拍中的pivot元素
    const t = array[k];
    let i = left;
    let j = right;

    swap(array, left, k);
    if (compare(array[right], t) > 0) {
      swap(array, left, right);
    }

    while (i < j) {
      swap(array, i, j), ++i, --j;
      while (compare(array[i], t) < 0) ++i;
      while (compare(array[j], t) > 0) --j;
    }

    if (compare(array[left], t) === 0) swap(array, left, j);
    else ++j, swap(array, j, right);

    if (j <= k) left = j + 1;
    if (k <= j) right = j - 1;
  }
  return array;
}

// 对数组中给定索引的两个元素进行交换
function swap(array, i, j) {
  const t = array[i];
  array[i] = array[j];
  array[j] = t;
}
