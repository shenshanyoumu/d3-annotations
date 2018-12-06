import { select } from "d3-selection";

function attrsFunction(selection, map) {
  return selection.each(function() {
    var x = map.apply(this, arguments),
      s = select(this);

    // 对具有多个attributes的设置，D3内部还是分别调用
    for (var name in x) s.attr(name, x[name]);
  });
}

function attrsObject(selection, map) {
  for (var name in map) selection.attr(name, map[name]);
  return selection;
}

export default function(map) {
  return (typeof map === "function" ? attrsFunction : attrsObject)(this, map);
}
