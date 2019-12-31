import ascending from "./ascending";
import number from "./number";
import quantile from "./quantile";

/**
 * 数组求中值
 * @param {*} values 
 * @param {*} valueof 用于将非数值型元素转换为数值型的算子
 */
export default function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      numbers = [];

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number(values[i]))) {
        numbers.push(value);
      }
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number(valueof(values[i], i, values)))) {
        numbers.push(value);
      }
    }
  }

  /** 数组升序排序后，计算分位点0.5的数值 */
  return quantile(numbers.sort(ascending), 0.5);
}
