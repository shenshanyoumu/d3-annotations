import node_count from "./count";
import node_each from "./each";
import node_eachBefore from "./eachBefore";
import node_eachAfter from "./eachAfter";
import node_sum from "./sum";
import node_sort from "./sort";
import node_path from "./path";
import node_ancestors from "./ancestors";
import node_descendants from "./descendants";
import node_leaves from "./leaves";
import node_links from "./links";

// 构造一棵树的函数,其中参数data为树根节点，而children函数表示访问节点孩子节点的方法
export default function hierarchy(data, children) {
  var root = new Node(data),
    valued = +data.value && (root.value = data.value),
    node,
    nodes = [root],
    child,
    childs,
    i,
    n;

  // 默认为每个节点具有children属性
  if (children == null) {
    children = defaultChildren;
  }

  // 下面按照深度优先构造完整树结构
  while ((node = nodes.pop())) {
    if (valued) {
      node.value = +node.data.value;
    }
    if ((childs = children(node.data)) && (n = childs.length)) {
      node.children = new Array(n);
      for (i = n - 1; i >= 0; --i) {
        nodes.push((child = node.children[i] = new Node(childs[i])));
        child.parent = node;
        child.depth = node.depth + 1;
      }
    }
  }

  // 先序构建树节点的深度
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

// 计算当前节点的深度，因此对于一棵树计算深度的方法，可以先计算所有叶子节点，然后从叶子节点反推到根节点的路径长度
export function computeHeight(node) {
  var height = 0;
  do node.height = height;
  while ((node = node.parent) && node.height < ++height);
}

// 树结构中节点对象
export function Node(data) {
  this.data = data;
  this.depth = this.height = 0;
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
