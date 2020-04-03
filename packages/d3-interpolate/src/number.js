/**
 * 数值区间线性插值，注意参数可以是数字字串
 * 返回一个插值器interpolator
 * @param {*} a 
 * @param {*} b 
 */
export default function(a, b) {
  return a = +a, b -= a, function(t) {
    return a + b * t;
  };
}
