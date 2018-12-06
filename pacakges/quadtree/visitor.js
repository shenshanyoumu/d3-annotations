import Quad from "./quad";

// 遍历四叉树节点，对每个节点调用callback
export default function(callback) {
  var quads = [],
    q,
    node = this._root,
    child,
    x0,
    y0,
    x1,
    y1;

  // 一种类似广度优先的方式遍历
  if (node) {
    quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
  }
  while ((q = quads.pop())) {
    if (
      !callback(
        (node = q.node),
        (x0 = q.x0),
        (y0 = q.y0),
        (x1 = q.x1),
        (y1 = q.y1)
      ) &&
      node.length
    ) {
      var xm = (x0 + x1) / 2,
        ym = (y0 + y1) / 2;

      // 根据父级空间位置坐标，得到四个子节点的空间位置坐标
      if ((child = node[3])) quads.push(new Quad(child, xm, ym, x1, y1));
      if ((child = node[2])) quads.push(new Quad(child, x0, ym, xm, y1));
      if ((child = node[1])) quads.push(new Quad(child, xm, y0, x1, ym));
      if ((child = node[0])) quads.push(new Quad(child, x0, y0, xm, ym));
    }
  }
  return this;
}
