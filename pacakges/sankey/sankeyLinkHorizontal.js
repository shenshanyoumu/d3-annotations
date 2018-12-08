import { linkHorizontal } from "d3-shape";

// Link对象的source/target表示两端的节点对象

// 计算Link的source节点矩形右上角位置
function horizontalSource(d) {
  return [d.source.x1, d.y0];
}

// 计算Link的target节点矩形左下角位置
function horizontalTarget(d) {
  return [d.target.x0, d.y1];
}

// 水平方向的Link生成器
export default function() {
  return linkHorizontal()
    .source(horizontalSource)
    .target(horizontalTarget);
}
