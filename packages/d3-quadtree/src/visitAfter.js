import Quad from "./quad.js";


// 对四叉树的后序遍历，即先将四叉树所有节点进行先序存储，然后从数组尾部逐个访问节点
export default function(callback) {
  var quads = [], next = [], q;
  if (this._root) {
    quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
  }

  while (q = quads.pop()) {
    var node = q.node;

    // 将当前节点的四个子节点保存到next数组
    if (node.length) {
      var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, 
      y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;

      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
    }

    // 将当前节点保存到quads数组
    next.push(q);
  }

  // 注意quads数组和next数组的差异，next数组包含叶子节点；而quuads只有非叶子节点
  while (q = next.pop()) {
    callback(q.node, q.x0, q.y0, q.x1, q.y1);
  }
  return this;
}
