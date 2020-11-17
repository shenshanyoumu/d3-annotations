import number from "./number";

/**
 * 计算数组均值
 * @param {*} values 
 * @param {*} valueof 
 */
export default function(values, valueof) {
  var n = values.length,
      m = n,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {

    // 下面代码表面，即使values数组中存在非数值元素，依然可以对有效元素进行求均值逻辑
    while (++i < n) {
      if (!isNaN(value = number(values[i]))) sum += value;
      else --m;
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number(valueof(values[i], i, values)))) sum += value;
      else --m;
    }
  }

  if (m) return sum / m;
}
