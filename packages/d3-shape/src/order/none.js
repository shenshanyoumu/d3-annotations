/**
 * series的内容并不关心，生成索引序列
 * @param {*} series 
 */
export default function(series) {
  var n = series.length, o = new Array(n);
  while (--n >= 0) o[n] = n;
  return o;
}
