/**
 * 降序排序器
 * @param {*} a 
 * @param {*} b 
 */
export default function(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}
