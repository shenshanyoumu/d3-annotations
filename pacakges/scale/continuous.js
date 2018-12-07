import { bisect } from "d3-array";
import {
  interpolate as interpolateValue,
  interpolateRound
} from "d3-interpolate";
import { map, slice } from "./array";
import constant from "./constant";
import number from "./number";

var unit = [0, 1];

export function deinterpolateLinear(a, b) {
  return (b -= a = +a)
    ? function(x) {
        return (x - a) / b;
      }
    : constant(b);
}

// deinterpolateClamp和reinterpolateClamp是一对互操作，用于将[0,1]区间与真实的[a,b]区间进行映射
function deinterpolateClamp(deinterpolate) {
  return function(a, b) {
    var d = deinterpolate((a = +a), (b = +b));
    return function(x) {
      return x <= a ? 0 : x >= b ? 1 : d(x);
    };
  };
}

function reinterpolateClamp(reinterpolate) {
  return function(a, b) {
    var r = reinterpolate((a = +a), (b = +b));
    return function(t) {
      return t <= 0 ? a : t >= 1 ? b : r(t);
    };
  };
}

// 比例尺缩小一倍，表示定义域不变，值域缩小一倍
function bimap(domain, range, deinterpolate, reinterpolate) {
  var d0 = domain[0],
    d1 = domain[1],
    r0 = range[0],
    r1 = range[1];
  if (d1 < d0) (d0 = deinterpolate(d1, d0)), (r0 = reinterpolate(r1, r0));
  else (d0 = deinterpolate(d0, d1)), (r0 = reinterpolate(r0, r1));
  return function(x) {
    return r0(d0(x));
  };
}

// 比例尺放大，类似定义域衰减半，值域不变
function polymap(domain, range, deinterpolate, reinterpolate) {
  var j = Math.min(domain.length, range.length) - 1,
    d = new Array(j),
    r = new Array(j),
    i = -1;

  // Reverse descending domains.
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++i < j) {
    d[i] = deinterpolate(domain[i], domain[i + 1]);
    r[i] = reinterpolate(range[i], range[i + 1]);
  }

  return function(x) {
    var i = bisect(domain, x, 1, j) - 1;
    return r[i](d[i](x));
  };
}

export function copy(source, target) {
  return target
    .domain(source.domain())
    .range(source.range())
    .interpolate(source.interpolate())
    .clamp(source.clamp());
}

// deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].

// 连续型比例尺，处理连续定义域和值域映射
/**
 *
 * @param {*} deinterpolate 调用形式为deinterpolate(a,b)(x)。X在[a,b]区间内，返回归一化的t属于[0,1]
 * @param {*} reinterpolate 调用形式为reinterpolate(a,b)(t)，t在[0,1]区间内，返回对应的X属于[a,b]
 */
export default function continuous(deinterpolate, reinterpolate) {
  var domain = unit,
    range = unit,
    interpolate = interpolateValue,
    clamp = false,
    piecewise,
    output,
    input;

  function rescale() {
    piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  // 比例缩放x倍，则定义域和值域的映射关系重新变化
  // 在图表通过brush进行刷取操作，就会在特定事件发生时调用比例尺的缩放函数
  function scale(x) {
    return (output ||
      (output = piecewise(
        domain,
        range,
        clamp ? deinterpolateClamp(deinterpolate) : deinterpolate,
        interpolate
      )))(+x);
  }

  // 比例尺的反，即定义域和值域互调后的比例关系
  scale.invert = function(y) {
    return (input ||
      (input = piecewise(
        range,
        domain,
        deinterpolateLinear,
        clamp ? reinterpolateClamp(reinterpolate) : reinterpolate
      )))(+y);
  };

  // 比例尺对象的定义域/值域
  scale.domain = function(_) {
    return arguments.length
      ? ((domain = map.call(_, number)), rescale())
      : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length
      ? ((range = slice.call(_)), rescale())
      : range.slice();
  };

  scale.rangeRound = function(_) {
    return (range = slice.call(_)), (interpolate = interpolateRound), rescale();
  };

  // 比例尺在特定区间有效，常常用于限定图表缩放范围
  scale.clamp = function(_) {
    return arguments.length ? ((clamp = !!_), rescale()) : clamp;
  };

  // 比例尺在缩放时可以使用插值得到中间状态
  scale.interpolate = function(_) {
    return arguments.length ? ((interpolate = _), rescale()) : interpolate;
  };

  return rescale();
}
