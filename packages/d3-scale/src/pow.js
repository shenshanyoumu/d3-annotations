import {linearish} from "./linear";
import {copy, identity, transformer} from "./continuous";
import {initRange} from "./init";

function transformPow(exponent) {
  return function(x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  };
}

function transformSqrt(x) {
  return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
}

function transformSquare(x) {
  return x < 0 ? -x * x : x * x;
}

// 幂函数scale
export function powish(transform) {
  // transform接受identity，表示对定义域和值域不进行处理
  var scale = transform(identity, identity),
      exponent = 1;

  // 
  function rescale() {
    return exponent === 1 ? transform(identity, identity)
        : exponent === 0.5 ? transform(transformSqrt, transformSquare)
        : transform(transformPow(exponent), transformPow(1 / exponent));
  }

  // 当幂函数指数发生变化，则需要rescale重新进行定义域和值域的映射
  scale.exponent = function(_) {
    return arguments.length ? (exponent = +_, rescale()) : exponent;
  };

  return linearish(scale);
}

export default function pow() {
  var scale = powish(transformer());

  scale.copy = function() {
    return copy(scale, pow()).exponent(scale.exponent());
  };

  initRange.apply(scale, arguments);

  return scale;
}

export function sqrt() {
  return pow.apply(null, arguments).exponent(0.5);
}
