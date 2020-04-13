import node_count from "./count.js";
import node_each from "./each.js";
import node_eachBefore from "./eachBefore.js";
import node_eachAfter from "./eachAfter.js";
import node_sum from "./sum.js";
import node_sort from "./sort.js";
import node_path from "./path.js";
import node_ancestors from "./ancestors.js";
import node_descendants from "./descendants.js";
import node_leaves from "./leaves.js";
import node_links from "./links.js";


// hierarchy生成器，用于根据参数来生成对应的层级数据结构
// data表示原始数组数据，children描述了如何获得'children'节点集合
// 比如在实际开发中，数组中子元素可能是别的名字，比如child。
export default function hierarchy(data, children) {
  var root = new Node(data),
      valued = +data.value && (root.value = data.value),
      node,
      nodes = [root],
      child,
      childs,
      i,
      n;

  // children函数，用于获取当前节点的子节点
  if (children == null) children = defaultChildren;

  // 层级优先遍历算法，
  while (node = nodes.pop()) {
    if (valued) node.value = +node.data.value;

    // 当前节点存在子节点，则遍历所有子节点，并用子节点新建Node对象，记录子节点的depth深度
    if ((childs = children(node.data)) && (n = childs.length)) {
      node.children = new Array(n);
      for (i = n - 1; i >= 0; --i) {
        nodes.push(child = node.children[i] = new Node(childs[i]));
        child.parent = node;
        child.depth = node.depth + 1;
      }
    }
  }

  // 从root节点开始，计算层级中每个节点相对叶子节点的高度。
  // 注意height相对叶子节点；depth相对root节点
  return root.eachBefore(computeHeight);
}

function node_copy() {
  return hierarchy(this).eachBefore(copyData);
}

function defaultChildren(d) {
  return d.children;
}

function copyData(node) {
  node.data = node.data.data;
}

// 从下到上计算节点的height，叶子节点的height为0
export function computeHeight(node) {
  var height = 0;
  do node.height = height;
  while ((node = node.parent) && (node.height < ++height));
}

// 层级布局中节点的depth表示从root节点到当前节点的深度；
// height表示当前节点到叶子节点的高度。d3通过这两个属性来美化布局
export function Node(data) {
  this.data = data;
  this.depth =
  this.height = 0;
  this.parent = null;
}

Node.prototype = hierarchy.prototype = {
  constructor: Node,
  count: node_count,
  each: node_each,
  eachAfter: node_eachAfter,
  eachBefore: node_eachBefore,
  sum: node_sum,
  sort: node_sort,
  path: node_path,
  ancestors: node_ancestors,
  descendants: node_descendants,
  leaves: node_leaves,
  links: node_links,
  copy: node_copy
};
