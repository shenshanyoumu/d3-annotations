import { Selection } from "./index";
import matcher from "../matcher";

export default function(match) {
  //D3的惯常做法，将非函数参数转化为函数
  if (typeof match !== "function") {
    match = matcher(match);
  }

  for (
    var groups = this._groups,
      m = groups.length,
      subgroups = new Array(m),
      j = 0;
    j < m;
    ++j
  ) {
    for (
      var group = groups[j],
        n = group.length,
        subgroup = (subgroups[j] = []),
        node,
        i = 0;
      i < n;
      ++i
    ) {
      // 过滤器的核心就是一个predicate函数，即下面的match函数
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
}
