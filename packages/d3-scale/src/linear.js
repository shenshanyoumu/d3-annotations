import {ticks, tickIncrement} from "d3-array";
import continuous, {copy, identity} from "./continuous";
import {initRange} from "./init";
import tickFormat from "./tickFormat";

// 参数为连续型scale，进行线性处理
export function linearish(scale) {
  var domain = scale.domain;

  // 根据定义域区间和刻度数量，返回刻度数组
  scale.ticks = function(count) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], 
      count == null ? 10 : count);
  };

  // specifier符合SI国际单位制，对刻度值的格式化处理
  scale.tickFormat = function(count, specifier) {
    var d = domain();
    return tickFormat(d[0], d[d.length - 1],
       count == null ? 10 : count, specifier);
  };

  // 坐标中刻度美化，比如对端点刻度的显示，防止刻度超过定义域范围
  scale.nice = function(count) {
    if (count == null) count = 10;

    var d = domain(),
        i0 = 0,
        i1 = d.length - 1,

        // 定义域区间范围
        start = d[i0],
        stop = d[i1],

        // step变量用于指示图表坐标轴刻度的数量和呈现
        step;

    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }

    step = tickIncrement(start, stop, count);

    if (step > 0) {
      // 美化坐标轴上定义域端点对应的刻度的位置
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
      step = tickIncrement(start, stop, count);
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
      step = tickIncrement(start, stop, count);
    }

    if (step > 0) {
      d[i0] = Math.floor(start / step) * step;
      d[i1] = Math.ceil(stop / step) * step;
      domain(d);
    } else if (step < 0) {
      d[i0] = Math.ceil(start * step) / step;
      d[i1] = Math.floor(stop * step) / step;
      domain(d);
    }

    return scale;
  };

  return scale;
}

export default function linear() {

  // 连续型scale函数，通过initRange初始化定义域和值域
  var scale = continuous(identity, identity);

  scale.copy = function() {
    return copy(scale, linear());
  };

  initRange.apply(scale, arguments);

  return linearish(scale);
}
