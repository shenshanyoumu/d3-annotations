// 广度优先访问树结构，也称为逐层访问树节点
export default function(callback) {
  var node = this,
    current,
    next = [node],
    children,
    i,
    n;
  do {
    // 注意下面reverse的时机，每一层遍历结束后就会对下一层节点处理前进行reverse
    (current = next.reverse()), (next = []);
    while ((node = current.pop())) {
      callback(node), (children = node.children);
      if (children)
        for (i = 0, n = children.length; i < n; ++i) {
          next.push(children[i]);
        }
    }
  } while (next.length);
  return this;
}
