import {bisect} from "d3-array";
import {interpolate as interpolateValue, 
  interpolateNumber, interpolateRound} from "d3-interpolate";

import {map, slice} from "./array";
import constant from "./constant";
import number from "./number";

var unit = [0, 1];


export function identity(x) {
  return x;
}

// 将区间[a,b]映射到[0,1]区间；
// 如果b为非数值或者b=a，则三目运算
function normalize(a, b) {
  return (b -= (a = +a))
      ? function(x) { return (x - a) / b; }
      : constant(isNaN(b) ? NaN : 0.5);
}

// 给定参数x，如果x在定义域范围外部，则夹逼到定义域端点
// 否则返回参数x
function clamper(domain) {
  var a = domain[0], 
    b = domain[domain.length - 1], t;
  if (a > b) t = a, a = b, b = t;
  
  return function(x) { 
    return Math.max(a, Math.min(b, x)); };
}

// normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
function bimap(domain, range, interpolate) {
  // 定义域和值域的区间范围表示
  var d0 = domain[0], d1 = domain[1], 
  r0 = range[0], r1 = range[1];

  if (d1 < d0) {
    // 定义域区间归一化处理，映射到[0,1]区间
    d0 = normalize(d1, d0), 

    // 对值域的插值处理，返回参数化后的插值器
    r0 = interpolate(r1, r0);
  }
   else{
    // 保持值域和定义域的区间升序
    d0 = normalize(d0, d1), 
    r0 = interpolate(r0, r1);
   }
  
  // 根据归一化后定义域上的参数x，返回值域上对应的点
  return function(x) { 
    return r0(d0(x)); 
  };
}

// domain数组长度大于2，则说明可以定义一系列定义域区间
// 同理，range数组长度大于2，可以定义一系列值域区间
function polymap(domain, range, interpolate) {
  var j = Math.min(domain.length, range.length) - 1,
      d = new Array(j),
      r = new Array(j),
      i = -1;

  // 确保定义域升序，值域同步反转(不需要确保值域升序)
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++i < j) {
    d[i] = normalize(domain[i], domain[i + 1]);

    // 值域区间进行插值，是为了将值域切割为离散或者连续的小区间
    r[i] = interpolate(range[i], range[i + 1]);
  }

  // bisect参数中1表示有序数组的low索引，j表示有序数组的high索引
  // 根据参数x，基于二分查找算法找到x对应的索引
  return function(x) {
    var i = bisect(domain, x, 1, j) - 1;

    // d[i]是归一化的定义域区间，通过参数x找到值域对应的点
    return r[i](d[i](x));
  };
}

// 两套scale实例的复制
export function copy(source, target) {
  return target
      .domain(source.domain())
      .range(source.range())
      .interpolate(source.interpolate())
      .clamp(source.clamp())
      .unknown(source.unknown());
}

export function transformer() {
  // 默认定义域和值域都是[0,1]区间
  var domain = unit,
      range = unit,

      // 默认插值函数
      interpolate = interpolateValue,
      
      // 对原始值域或者定义域的转换函数，用于转换为可计算的形式
      transform,
      untransform,
      unknown,
      clamp = identity,

      // piecewise表示归一化后值域到定义域的映射函数；
      // 注意可以传递多个定义域数组和值域数组
      piecewise,

      // 类似函数中的自变量和因变量
      output,
      input;

  // scale的定义域和值域重新建立映射关系
  function rescale() {
     piecewise = Math.min(domain.length, range.length) > 2 ?
     polymap : bimap;
     output = input = null;
    return scale;
  }

  // 根据定义域上的参数x，计算对应值域上的点
  function scale(x) {
    return isNaN(x = +x) ? 
    unknown : (output ||
       (output = piecewise(
        // transform函数对定义域原始元素进行转换，使得后续的数值计算能够可能
         domain.map(transform), range, interpolate
         )))(transform(clamp(x)));
  }

  // 注意piecewise的参数顺序，因此相当于反函数。
  // 即根据值域中的因变量计算定义域中的自变量
  scale.invert = function(y) {
    return clamp(untransform(
      (input || (input = piecewise
        (range, domain.map(transform), interpolateNumber
        )))(y)));
  };

  // 定义域赋值，rescale()返回scale
  scale.domain = function(_) {
    return arguments.length ? (
      domain = map.call(_, number), 
      clamp === identity ||
      (clamp = clamper(domain)), rescale()) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range = slice.call(_), rescale()) : range.slice();
  };

  // 用于视觉美化的定义域插值
  scale.rangeRound = function(_) {
    return range = slice.call(_), 
    interpolate = interpolateRound, rescale();
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = _ ? clamper(domain) : identity, scale) : clamp !== identity;
  };

  scale.interpolate = function(_) {
    return arguments.length ? (interpolate = _, rescale()) : interpolate;
  };

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  // 外部传递定义域/值域的转换函数，并返回scale比例尺函数
  return function(t, u) {
    transform = t, untransform = u;
    return rescale();
  };
}

// 连续型比例尺构造，与离散型对立
export default function continuous(transform, untransform) {
  return transformer()(transform, untransform);
}
