/**
 * 
 * @param {*} array 
 * @param {*} indexes 用于组合排序的索引序列
 */
export default function(array, indexes) {
  var i = indexes.length, permutes = new Array(i);
  while (i--) permutes[i] = array[indexes[i]];
  return permutes;
}
