/**
 * 根据给定序列长度，生成基数序列
 * @param {*} series 
 */
export default function(series) {
  var n = series.length, o = new Array(n);
  while (--n >= 0) o[n] = n;
  return o;
}
