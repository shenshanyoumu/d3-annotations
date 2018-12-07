import dice from "./dice";
import slice from "./slice";

// 根据parent的depth的奇偶性，对空间交叉进行水平分割和垂直分割
export default function(parent, x0, y0, x1, y1) {
  (parent.depth & 1 ? slice : dice)(parent, x0, y0, x1, y1);
}
