import constant from "./constant";

// 线性插值器
function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

// 指数型插值器
function exponential(a, b, y) {
  return (
    (a = Math.pow(a, y)),
    (b = Math.pow(b, y) - a),
    (y = 1 / y),
    function(t) {
      return Math.pow(a + t * b, y);
    }
  );
}

// 对色彩的插值
export function hue(a, b) {
  var d = b - a;
  return d
    ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d)
    : constant(isNaN(a) ? b : a);
}

export function gamma(y) {
  return (y = +y) === 1
    ? nogamma
    : function(a, b) {
        return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
      };
}

// 在CSS的filter实现中，就是使用了颜色的插值计算
export default function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant(isNaN(a) ? b : a);
}
