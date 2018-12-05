// 在D3的实现中，充分吸收了JS的迭代器思维，
// 即在迭代过程中使用外部传递的访问函数来进一步处理
export default function min(values, valueof) {
  let min;
  if (valueof === undefined) {
    // 当不存在访问器函数，则按照values集合中元素的“自然”顺序比较大小
    // 所谓自然顺序，即对数值数组的元素比较大小；而对于字符串的字符则比较字母序
    for (let value of values) {
      if (
        value != null &&
        value >= value &&
        (min === undefined || min > value)
      ) {
        min = value;
      }
    }
  } else {
    let index = -1;
    // 当访问器函数作为参数存在时，则根据访问器函数的实现规则重新对原来的迭代元素进行处理
    for (let value of values) {
      if (
        (value = valueof(value, ++index, values)) != null &&
        value >= value &&
        (min === undefined || min > value)
      ) {
        min = value;
      }
    }
  }
  return min;
}
