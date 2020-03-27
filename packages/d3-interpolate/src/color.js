import constant from "./constant.js";

/**
 * 高阶线性插值函数
 * @param {*} a 
 * @param {*} d 
 */
function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

/**
 * 高阶指数形式的插值函数，其中参数t表示插值点
 * 下面的算法过程可以通过例子来理解，比如a=10,b=100,y=2，则当t在[0,1]区间变化时的值
 * @param {*} a 
 * @param {*} b 
 * @param {*} y 
 */
function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

/**
 * HSL颜色空间中hue属性的插值。hue范围在[0,360]
 * @param {*} a 
 * @param {*} b 
 */
export function hue(a, b) {
  /** 数值型或者数字串都可以进行基本运算 */
  var d = b - a;
  /** d为0或者d表示NaN，则三目运算后面部分；将d约束在180之内 */
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant(isNaN(a) ? b : a);
}

/**
 * RGB颜色空间
 * @param {*} y 
 */
export function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
  };
}

export default function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant(isNaN(a) ? b : a);
}
