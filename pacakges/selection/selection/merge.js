import { Selection } from "./index";

// 多个选择集的合并，在应用中数据集是动态变化的因此每次新的数据集都需要和之前的数据集合并
// 同时还要处理对应的DOM集的绑定
export default function(selection) {
  for (
    var groups0 = this._groups,
      groups1 = selection._groups,
      m0 = groups0.length,
      m1 = groups1.length,
      m = Math.min(m0, m1),
      merges = new Array(m0),
      j = 0;
    j < m;
    ++j
  ) {
    for (
      var group0 = groups0[j],
        group1 = groups1[j],
        n = group0.length,
        merge = (merges[j] = new Array(n)),
        node,
        i = 0;
      i < n;
      ++i
    ) {
      if ((node = group0[i] || group1[i])) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
}
