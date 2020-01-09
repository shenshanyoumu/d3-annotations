/**
 * 分段插值
 * @param {*} interpolate 高阶的插值函数，调用后返回真正的插值函数
 * @param {*} values 插值采样点数组
 */
export default function piecewise(interpolate, values) {
  var i = 0, n = values.length - 1, v = values[0], I = new Array(n < 0 ? 0 : n);
  while (i < n) 
    I[i] = interpolate(v, v = values[++i]);

  return function(t) {
    var i = Math.max(0, Math.min(n - 1, Math.floor(t *= n)));
    return I[i](t - i);
  };
}
