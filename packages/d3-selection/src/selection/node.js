
export default function() {
  // 选择集的二维化，因此时间复杂度为O(n^2)
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
     
      // 如果选择集不为空，则返回选择集中第一个节点即可
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}
