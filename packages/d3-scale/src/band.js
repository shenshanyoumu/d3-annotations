import {range as sequence} from "d3-array";
import {initRange} from "./init";
import ordinal from "./ordinal";

// 带状scale，类似直方图的bin。即定义域非连续，而值域连续
export default function band() {
  var scale = ordinal().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      range = [0, 1],
      step,
      bandwidth,
      round = false,
      paddingInner = 0,
      paddingOuter = 0,
      align = 0.5;

  delete scale.unknown;

  // rescale表示定义域和值域的重新映射，一般当值域定义域发生变化时触发
  function rescale() {
    var n = domain().length,

        // reverse是一个布尔值，布尔值的算术运算会隐式转化为false/0；true/1
        reverse = range[1] < range[0],
        start = range[reverse - 0],
        stop = range[1 - reverse];
    
    // band scale中，定义域每个点在坐标轴占据一个带状区间
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);

    // 重新定义值域区间下界
    start += (stop - start - step * (n - paddingInner)) * align;

    // 坐标轴上因变量绘制宽度
    bandwidth = step * (1 - paddingInner);
    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
    
    // 值域的离散化处理
    var values = sequence(n).map(function(i) { return start + step * i; });
    return ordinalRange(reverse ? values.reverse() : values);
  }

  // 定义域赋值
  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  // 值域赋值
  scale.range = function(_) {
    return arguments.length ? 
    (range = [+_[0], +_[1]], rescale()) : range.slice();
  };

  // 值域区间端点美化处理
  scale.rangeRound = function(_) {
    return range = [+_[0], +_[1]], round = true, rescale();
  };

  scale.bandwidth = function() {
    return bandwidth;
  };

  scale.step = function() {
    return step;
  };

  scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };

  // band之间的填充空间
  scale.padding = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
  };

  scale.paddingInner = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
  };

  scale.paddingOuter = function(_) {
    return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
  };

  scale.align = function(_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };

  scale.copy = function() {
    return band(domain(), range)
        .round(round)
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter)
        .align(align);
  };

  return initRange.apply(rescale(), arguments);
}

function pointish(scale) {
  var copy = scale.copy;

  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;

  scale.copy = function() {
    return pointish(copy());
  };

  return scale;
}

export function point() {
  return pointish(band.apply(null, arguments).paddingInner(1));
}
