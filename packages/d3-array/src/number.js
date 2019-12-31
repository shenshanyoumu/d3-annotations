/**
 * 数值型判定器
 * @param {*} x 
 */
export default function(x) {
  return x === null ? NaN : +x;
}
