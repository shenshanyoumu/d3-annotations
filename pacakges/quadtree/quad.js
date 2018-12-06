// 四叉树的节点结构，由于四叉树节点表示一个二维空间。
// 需要存储二维空间的位置坐标，以及节点对象。而节点对象由包含其子节点的信息
export default function(node, x0, y0, x1, y1) {
  this.node = node;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}
