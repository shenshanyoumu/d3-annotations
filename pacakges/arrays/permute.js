// 根据给定的索引列表，将原数组中元素打乱
export default function(array, indexes) {
  var i = indexes.length,
    permutes = new Array(i);
  while (i--) permutes[i] = array[indexes[i]];
  return permutes;
}
