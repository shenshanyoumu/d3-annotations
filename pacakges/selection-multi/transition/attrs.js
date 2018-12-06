import { select } from "d3-selection";

// 对多attributes的渐变动画，转换为对其中每个attribute单独施加渐变过程
function attrsFunction(transition, map) {
  return transition.each(function() {
    var x = map.apply(this, arguments),
      t = select(this).transition(transition);
    for (var name in x) {
      t.attr(name, x[name]);
    }
  });
}

function attrsObject(transition, map) {
  for (var name in map) transition.attr(name, map[name]);
  return transition;
}

export default function(map) {
  return (typeof map === "function" ? attrsFunction : attrsObject)(this, map);
}
