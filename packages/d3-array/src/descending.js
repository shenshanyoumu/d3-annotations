/**
 * 降序排序子，类似C语言中的仿函数
 * @param {*} a 
 * @param {*} b 
 */
export default function(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}
