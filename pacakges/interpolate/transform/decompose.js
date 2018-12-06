var degrees = 180 / Math.PI;

// 仿射变换包括平移、旋转、缩放和剪切
// 下面表示未进行任何变换
export var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

/**
 * 注意W3C中CSS的transform属性值在不同浏览器的解释是不一样的
 * @param {*} a 表示X方向的缩放比
 * @param {*} b 表示Y方向的剪切度数
 * @param {*} c 表示X方向上的剪切度数
 * @param {*} d 表示Y方向上的缩放比
 * @param {*} e 表示X轴上的位移
 * @param {*} f 表示Y轴上的位移
 */
export default function(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if ((scaleX = Math.sqrt(a * a + b * b))) {
    (a /= scaleX), (b /= scaleX);
  }
  if ((skewX = a * c + b * d)) {
    (c -= a * skewX), (d -= b * skewX);
  }
  if ((scaleY = Math.sqrt(c * c + d * d))) {
    (c /= scaleY), (d /= scaleY), (skewX /= scaleY);
  }

  if (a * d < b * c) {
    (a = -a), (b = -b), (skewX = -skewX), (scaleX = -scaleX);
  }

  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}
