
// 参数node表示一个四叉树节点实例；而后面组成的两个坐标点用于描述当前节点划分的空间位置
export default function(node, x0, y0, x1, y1) {
  this.node = node;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}
