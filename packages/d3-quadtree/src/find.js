import Quad from "./quad.js";

// 找到给定坐标点[x,y]在半径radius范围内的所有节点数据
export default function(x, y, radius) {
  var data,
      x0 = this._x0,
      y0 = this._y0,
      x1,
      y1,
      x2,
      y2,
      x3 = this._x1,
      y3 = this._y1,
      quads = [],
      node = this._root,
      q,
      i;

      // 非空四叉树，则保存root节点
  if (node) quads.push(new Quad(node, x0, y0, x3, y3));
  if (radius == null) radius = Infinity;

  // 在给定坐标[x,y]，半径为radius的矩形区域范围[x0,y0]左上角；[x3,y3]右下角
  else {
    x0 = x - radius, y0 = y - radius;
    x3 = x + radius, y3 = y + radius;
    radius *= radius;
  }

  while (q = quads.pop()) {

    // Stop searching if this quadrant can’t contain a closer node.
    // 如果由[[x0,y0],[x3,y3]]形成的矩形区域与当前节点矩形区域不想交，则重新pop一个节点
    if (!(node = q.node)
        || (x1 = q.x0) > x3
        || (y1 = q.y0) > y3
        || (x2 = q.x1) < x0
        || (y2 = q.y1) < y0) continue;

    // node.length不为false，则表示node为非叶子节点
    if (node.length) {
      var xm = (x1 + x2) / 2,
          ym = (y1 + y2) / 2;

      // node节点的四个子节点加入队列
      quads.push(
        new Quad(node[3], xm, ym, x2, y2),
        new Quad(node[2], x1, ym, xm, y2),
        new Quad(node[1], xm, y1, x2, ym),
        new Quad(node[0], x1, y1, xm, ym)
      );

      // 给定参数[x,y]与当前node节点的相对位置关系，即上下左右的位置描述
      if (i = (y >= ym) << 1 | (x >= xm)) {

        // 将包含参数[x,y]的子区域交换到quads尾部
        q = quads[quads.length - 1];
        quads[quads.length - 1] = quads[quads.length - 1 - i];
        quads[quads.length - 1 - i] = q;
      }
    }

    // 对于叶子结点，如果该叶子节点属于[x,y]的radius半径内，则表示找到符合要求的节点数据
    else {
      var dx = x - +this._x.call(null, node.data),
          dy = y - +this._y.call(null, node.data),
          d2 = dx * dx + dy * dy;

      if (d2 < radius) {
        var d = Math.sqrt(radius = d2);
        x0 = x - d, y0 = y - d;
        x3 = x + d, y3 = y + d;
        data = node.data;
      }
    }
  }

  return data;
}
