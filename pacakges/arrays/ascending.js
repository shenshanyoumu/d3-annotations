// 凡是涉及排序，最佳实践就是定义各种排序访问器
// 排序过程中迭代调用指定的访问器完成排序
export default function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
