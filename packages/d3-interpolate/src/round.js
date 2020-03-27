/**
 * 数值区间的线性插值，并针对插值结果进行四舍五入
 * @param {*} a 
 * @param {*} b 
 */
export default function(a, b) {
  return a = +a, b -= a, function(t) {
    return Math.round(a + b * t);
  };
}
