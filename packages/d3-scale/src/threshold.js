import {bisect} from "d3-array";
import {slice} from "./array";
import {initRange} from "./init";

// 阈值比例尺
export default function threshold() {
  var domain = [0.5],
      range = [0, 1],
      unknown,

      // 记录定义域和值域数组长度的最小值
      n = 1;

  // x<=x，用于判定x是数值型，否则x为NaN。
  // bisect二分查找算法返回定义域中参数x的索引，并映射到值域
  function scale(x) {
    return x <= x ? range[bisect(domain, x, 0, n)] : unknown;
  }

  scale.domain = function(_) {
    return arguments.length ? (domain = slice.call(_),
     n = Math.min(domain.length, range.length - 1), scale) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range = slice.call(_),
     n = Math.min(domain.length, range.length - 1), scale) : range.slice();
  };

  // scale逆函数，根据因变量确定值域区间。
  // 这个函数在图表缩放中使用
  scale.invertExtent = function(y) {
    var i = range.indexOf(y);
    return [domain[i - 1], domain[i]];
  };

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function() {
    return threshold()
        .domain(domain)
        .range(range)
        .unknown(unknown);
  };

  return initRange.apply(scale, arguments);
}
