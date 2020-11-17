/**
 * 排序仿函数，注意下面三目运算符的优先级
 * 比较运算符应用于可比较的数据类型，比如数值型或者字符
 * 针对字符则比较字母表顺序
 * @param {*} a 
 * @param {*} b 
 */
export default function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
