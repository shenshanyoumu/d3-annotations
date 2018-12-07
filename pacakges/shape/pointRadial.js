// 给定旋转角度x以及旋转半径y，返回对应的point.
// 注意，从12点方向开始旋转角以顺时针为正，
export default function(x, y) {
  return [(y = +y) * Math.cos((x -= Math.PI / 2)), y * Math.sin(x)];
}
