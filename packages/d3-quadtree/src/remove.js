
// 将给定坐标点d从四叉树移除，则需要重新调整四叉树结构
export default function(d) {
  if (isNaN(x = +this._x.call(null, d)) || 
      isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

  var parent,
      node = this._root,
      retainer,
      previous,

      // 
      next,

      // 四叉树节点的空间范围
      x0 = this._x0,
      y0 = this._y0,
      x1 = this._x1,
      y1 = this._y1,
      x,
      y,
      xm,
      ym,
      right,
      bottom,
      i,
      j;

  // 如果是空树，则直接返回
  if (!node) return this;

  // Find the leaf node for the point.
  // While descending, also retain the deepest parent with a non-removed sibling.
  // 
  if (node.length) while (true) {

    // 给定参数d的X分量/y分量与当前节点空间X中点/y中点比较，类似二分法
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;

    // 如果参数d并不存在于当前四叉树空间范围，则直接返回；否则用parent记录父节点，node为子节点
    // bottom<<1||right可以得到参数[x,y]与当前节点空间的中点位置的上下左右关系
    if (!(parent = node, node = node[i = bottom << 1 | right])) return this;

    // 如果寻找到叶子结点，则退出循环
    if (!node.length) break;

    // i取值范围[0,1,2,3]分别为节点的四个子节点。将匹配的节点的parent节点保存到retainer
    if (parent[(i + 1) & 3] || parent[(i + 2) & 3] ||
     parent[(i + 3) & 3]) retainer = parent, j = i;
  }

  // previous记录同一层级前一个兄弟节点
  while (node.data !== d) {
    if (!(previous = node, node = node.next)) return this;
  }

  // 将匹配的节点删除
  if (next = node.next) delete node.next;

  // If there are multiple coincident points, remove just the point.
  // 
  if (previous) {
    return (next ? previous.next = next : delete previous.next), this;
  }

  // If this is the root point, remove it.
  if (!parent) return this._root = next, this;

  // Remove this leaf.
  next ? parent[i] = next : delete parent[i];

  // 如果当前父节点只有一个子节点，则该父节点没有存在意义，可以将子节点提升为父节点位置
  if ((node = parent[0] || parent[1] || parent[2] || parent[3])
      && node === (parent[3] || parent[2] || parent[1] || parent[0])
      && !node.length) {

    if (retainer) retainer[j] = node;
    else this._root = node;
  }

  return this;
}

export function removeAll(data) {
  for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
  return this;
}
