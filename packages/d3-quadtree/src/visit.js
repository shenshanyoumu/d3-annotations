import Quad from "./quad.js";

// 四叉树先序遍历
export default function(callback) {
  var quads = [], q, node = this._root, child, x0, y0, x1, y1;

  // 将四叉树根节点及其空间范围保存
  if (node) {
    quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
  }

  // 层级遍历来访问每个节点
  while (q = quads.pop()) {

    // 每个节点的回调函数执行后如果返回true，则不遍历子节点；否则进行子节点遍历
    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
      var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;

      // 四叉树非叶子节点由4个子节点。将空间矩形区域划均分四块
      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
    }
  }
  return this;
}
