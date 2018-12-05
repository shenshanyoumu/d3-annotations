import constant from "./constant";

// 线性插值
function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

// 色彩值的插值运算
export function hue(a, b) {
  var d = b - a;
  return d
    ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d)
    : constant(isNaN(a) ? b : a);
}

export default function(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant(isNaN(a) ? b : a);
}
