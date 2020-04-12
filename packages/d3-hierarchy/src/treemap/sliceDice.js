import dice from "./dice.js";
import slice from "./slice.js";

// parent.depth&1用来计算当前层级节点的奇偶层数，
// 如果是奇数层则按照水平方向切割矩形的高
// 反之则按照垂直方向切割矩形的宽
export default function(parent, x0, y0, x1, y1) {
  (parent.depth & 1 ? slice : dice)(parent, x0, y0, x1, y1);
}
