/**
 * 返回特定的颜色方案
 * @param {*} ranges 表示一组颜色方案，而每个颜色方案包含一系列颜色值
 */
export default function(ranges) {
  ranges = ranges.map(function(colors) {
    return colors.match(/.{6}/g).map(function(x) {
      return "#" + x;
    });
  });
  var n0 = ranges[0].length;
  return function(n) {
    return ranges[n - n0];
  };
}
