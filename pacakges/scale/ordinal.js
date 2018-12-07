import { slice } from "./array";

export var implicit = { name: "implicit" };

// 所谓比例尺，就是数据定义域与图表值域的映射函数

// 序列比例尺，针对离散的定义域和值域的映射。
export default function ordinal(range) {
  // ES原生的Map结构
  var index = new Map(),
    domain = [],
    unknown = implicit;

  range = range == null ? [] : slice.call(range);

  function scale(d) {
    var key = d + "",
      i = index.get(key);
    if (!i) {
      if (unknown !== implicit) return unknown;
      index.set(key, (i = domain.push(d)));
    }
    return range[(i - 1) % range.length];
  }

  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    (domain = []), (index = new Map());
    var i = -1,
      n = _.length,
      d,
      key;
    while (++i < n)
      if (!index.has((key = (d = _[i]) + ""))) index.set(key, domain.push(d));
    return scale;
  };

  scale.range = function(_) {
    return arguments.length ? ((range = slice.call(_)), scale) : range.slice();
  };

  scale.unknown = function(_) {
    return arguments.length ? ((unknown = _), scale) : unknown;
  };

  scale.copy = function() {
    return ordinal()
      .domain(domain)
      .range(range)
      .unknown(unknown);
  };

  return scale;
}
