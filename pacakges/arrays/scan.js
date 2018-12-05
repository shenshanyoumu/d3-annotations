import ascending from "./ascending";

// 注意下面扫描器的功能：即根据传入的比较器，得到符合比较器断言的元素集合中最小的一个元素在原来迭代结构的索引
export default function scan(values, compare = ascending) {
  let min;
  let minIndex;
  let index = -1;
  for (const value of values) {
    ++index;
    if (
      minIndex === undefined
        ? compare(value, value) === 0
        : compare(value, min) < 0
    ) {
      min = value;
      minIndex = index;
    }
  }
  return minIndex;
}
