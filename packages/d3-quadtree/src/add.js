// 在给定的四叉树中新增一个坐标点，则需要调整四叉树结构
export default function(d) {
  var x = +this._x.call(null, d),
      y = +this._y.call(null, d);

  // this.cover(x,y)表示将原四叉树覆盖到给定的坐标[x,y]
  return add(this.cover(x, y), x, y, d);
}

function add(tree, x, y, d) {
  if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

  var parent,
      node = tree._root,
      leaf = {data: d},
      x0 = tree._x0,
      y0 = tree._y0,
      x1 = tree._x1,
      y1 = tree._y1,
      xm,
      ym,
      xp,
      yp,
      right,
      bottom,
      i,
      j;

  // 如果是空树，则初始化四叉树，并对根节点的data属性赋值
  if (!node) return tree._root = leaf, tree;

  // 如果四叉树的叶子节点恰好无法覆盖该坐标点，则直接添加为叶子节点即可。
  // 同时也说明一个节点的子节点不满4个
  while (node.length) {
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
    if (parent = node, !(node = node[i = bottom << 1 | right])) 
      return parent[i] = leaf, tree;
  }

  // 此时的node一定是四叉树叶子结点，计算给叶子结点的XY坐标分量
  xp = +tree._x.call(null, node.data);
  yp = +tree._y.call(null, node.data);

  // 如果同一位置出现两个相同节点，则都作为parent节点的子节点插入。此时parent的叶子节点数目不能超过4
  if (x === xp && y === yp) 
    return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

  // Otherwise, split the leaf node until the old and new point are separated.
  // 如果parent的叶子节点超过4；则需要将叶子节点拆分为新的parent和子节点
  do {
    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;

    // 
  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));

  
  return parent[j] = node, parent[i] = leaf, tree;
}

export function addAll(data) {
  var d, i, n = data.length,
      x,
      y,
      xz = new Array(n),
      yz = new Array(n),
      x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity;

  // Compute the points and their extent.
  for (i = 0; i < n; ++i) {
    if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
    xz[i] = x;
    yz[i] = y;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }

  // If there were no (valid) points, abort.
  if (x0 > x1 || y0 > y1) return this;

  // Expand the tree to cover the new points.
  this.cover(x0, y0).cover(x1, y1);

  // Add the new points.
  for (i = 0; i < n; ++i) {
    add(this, xz[i], yz[i], data[i]);
  }

  return this;
}
