/**
 * 数值区间线性插值
 * @param {*} a 
 * @param {*} b 
 */
export default function(a, b) {
  return a = +a, b -= a, function(t) {
    return a + b * t;
  };
}
