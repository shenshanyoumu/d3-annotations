import { min } from "d3-array";

// 桑基图的布局器

/**
 * 计算link对象的target节点的深度
 * @param {*} d 表示Link对象
 */
function targetDepth(d) {
  return d.target.depth;
}

// 计算节点深度，即当前节点与最左边节点的跳数
export function left(node) {
  return node.depth;
}

/**
 *
 * @param {*} node 当前节点
 * @param {*} n 桑基图最大深度
 */
export function right(node, n) {
  return n - 1 - node.height;
}

// 如果当前节点具有向后续节点发从的Links，则表示该节点为整个桑基图的非叶子节点
// 计算当前节点的深度值，即从最左边开始到当前节点的层数；如果当前节点为叶子节点，则返回最右一层
export function justify(node, n) {
  return node.sourceLinks.length ? node.depth : n - 1;
}

//节点
export function center(node) {
  return node.targetLinks.length
    ? node.depth
    : node.sourceLinks.length
    ? min(node.sourceLinks, targetDepth) - 1
    : 0;
}
