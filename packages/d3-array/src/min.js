/**
 * 请求数组最小值，注意values并非一定是数值型数组；
 * 如果没有valueOf参数，则确保values中元素可比较
 * @param {*} values 
 * @param {*} valueof 
 */
export default function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    /** 虽然是双重循环，但是indicator共同，因此实际上退化为一维数组 */
    while (++i < n) {
      /** value>=value这一步操作并非多此一举，实际上就是确保元素间的可比较性 */
      if ((value = values[i]) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
}
