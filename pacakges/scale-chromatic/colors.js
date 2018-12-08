/**
 * 返回符合CSS规范的颜色数组
 * @param {*} specifier 类似‘f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b’形式来拆分出颜色序列
 */
export default function(specifier) {
  var n = (specifier.length / 6) | 0,
    colors = new Array(n),
    i = 0;
  while (i < n) {
    colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  }
  return colors;
}
