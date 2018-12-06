import { select } from "d3-selection";

// 与properties和attrs同理，这只是D3的语法糖
function stylesFunction(selection, map, priority) {
  return selection.each(function() {
    var x = map.apply(this, arguments),
      s = select(this);
    for (var name in x) s.style(name, x[name], priority);
  });
}

function stylesObject(selection, map, priority) {
  for (var name in map) selection.style(name, map[name], priority);
  return selection;
}

export default function(map, priority) {
  return (typeof map === "function" ? stylesFunction : stylesObject)(
    this,
    map,
    priority == null ? "" : priority
  );
}
