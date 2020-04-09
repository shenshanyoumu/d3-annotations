import {map} from "d3-collection";
import {slice} from "./array";
import {initRange} from "./init";

export var implicit = {name: "implicit"};

// 序数scale，定义域和值域是离散点
export default function ordinal() {

  // 
  var index = map(),
      // 定义域的序列数组
      domain = [],
      range = [],
      unknown = implicit;

  // 根据定义域某个离散点，返回值域对应的离散点
  function scale(d) {
    var key = d + "", i = index.get(key);
    if (!i) {
      if (unknown !== implicit) return unknown;
      index.set(key, i = domain.push(d));
    }
    return range[(i - 1) % range.length];
  }

  scale.domain = function(_) {
    // 序数比例尺默认定义域
    if (!arguments.length) {
      return domain.slice();
    }
    domain = [], index = map();
    var i = -1, n = _.length, d, key;

    // 基于离散化定义域元素来进行内部定义域数组的赋值
    while (++i < n) 
      if (!index.has(key = (d = _[i]) + "")) 
        index.set(key, domain.push(d));

    // JS中进行链式调用的模式
    return scale;
  };

  // 值域为离散化数组
  scale.range = function(_) {
    return arguments.length ? 
    (range = slice.call(_), scale) : range.slice();
  };

  scale.unknown = function(_) {
    return arguments.length ? 
    (unknown = _, scale) : unknown;
  };

  scale.copy = function() {
    return ordinal(domain, range).unknown(unknown);
  };

  // scale初始化定义域和值域。注意下面参数arguments属于ordinal()函数
  // 因此在scale.copy方法执行中，会初始化序数scale的定义域和值域
  initRange.apply(scale, arguments);

  return scale;
}
