import {map} from "./array";
import {linearish} from "./linear";
import number from "./number";

export default function identity(domain) {
  var unknown;

  function scale(x) {
    return isNaN(x = +x) ? unknown : x;
  }

  // 如果函数与反函数等价，则说明是定义域的自映射
  scale.invert = scale;

  scale.domain = scale.range = function(_) {
    return arguments.length ? (domain = map.call(_, number), scale) : domain.slice();
  };

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function() {
    return identity(domain).unknown(unknown);
  };

  domain = arguments.length ? map.call(domain, number) : [0, 1];

  return linearish(scale);
}
