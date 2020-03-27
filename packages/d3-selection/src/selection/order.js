export default function() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        // compareDocumentPosition是DOM规范定义的比较两个节点相对位置关系的函数
        // 当next节点在node节点前面，则将next节点在DOM树上插入node节点之前
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}
