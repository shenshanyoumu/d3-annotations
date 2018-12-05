/**
 * 在图表操作中，定义域/值域映射、刷子选择区域等都需要下面的运算逻辑
 * 该函数返回给定迭代结构的范围表示
 * @param {*} values
 * @param {*} valueof
 */
export default function(values, valueof) {
  let min;
  let max;
  if (valueof === undefined) {
    // 比较简单的实现
    for (let value of values) {
      if (value != null && value >= value) {
        if (min === undefined) {
          min = max = value;
        } else {
          if (min > value) min = value;
          if (max < value) max = value;
        }
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && value >= value) {
        if (min === undefined) {
          min = max = value;
        } else {
          if (min > value) min = value;
          if (max < value) max = value;
        }
      }
    }
  }
  return [min, max];
}
