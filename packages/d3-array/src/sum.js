/**
 * 数组元素求和运算，注意valueof用于将数组中非数值元素映射到数值空间
 * @param {*} values 
 * @param {*} valueof 
 */
export default function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
    }
  }

  else {
    while (++i < n) {
      if (value = +valueof(values[i], i, values)) sum += value;
    }
  }

  return sum;
}