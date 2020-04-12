import {required} from "./accessors.js";
import {Node, computeHeight} from "./hierarchy/index.js";

var keyPrefix = "$", // Protect against keys like “__proto__”.
    preroot = {depth: -1},
    ambiguous = {};

function defaultId(d) {
  return d.id;
}

function defaultParentId(d) {
  return d.parentId;
}

// stratify表示将Tabular数据进行层级化处理
export default function() {

  // 两个函数变量用于获得当前data对象的关键字，以及层级化后的父亲节点的关键字
  var id = defaultId,
      parentId = defaultParentId;

  function stratify(data) {
    var d,
        i,
        n = data.length,
        root,
        parent,
        node,
        nodes = new Array(n),
        nodeId,
        nodeKey,
        nodeByKey = {};

    // 注意下面将flatten的数组转换为map结构，其中需要注意的是
    // 如果flatten数组中元素存在相同的key或者原型链关键字，则表示这些数据对最终层级存在异常，
    // 因此处理为ambiguous,并在构建层级树时抛错异常
    for (i = 0; i < n; ++i) {
      d = data[i], node = nodes[i] = new Node(d);
      if ((nodeId = id(d, i, data)) != null && (nodeId += "")) {
        nodeKey = keyPrefix + (node.id = nodeId);
        nodeByKey[nodeKey] = nodeKey in nodeByKey ? ambiguous : node;
      }
    }


    for (i = 0; i < n; ++i) {
      node = nodes[i], nodeId = parentId(data[i], i, data);

      // 下面代码的巧妙之处在于，如果只要一个root节点，则不会抛错
      // 如果已经存在root节点，同时另一个节点的parentId也为null，则抛错
      if (nodeId == null || !(nodeId += "")) {
        if (root) throw new Error("multiple roots");
        root = node;
      } else {
        // Map中找到parentID对应的键值
        parent = nodeByKey[keyPrefix + nodeId];

        if (!parent) throw new Error("missing: " + nodeId);

        // 
        if (parent === ambiguous) throw new Error("ambiguous: " + nodeId);
        
        // 将当前node节点push到父节点的children数组中，从而形成层级化
        if (parent.children) parent.children.push(node);
        else parent.children = [node];
        node.parent = parent;
      }
    }

    if (!root) throw new Error("no root");
    root.parent = preroot;

    // 从上到下遍历层级对象，计算每个节点相对root节点的depth；
    // 再从上到下遍历层级对象，计算每个节点相对于叶子节点的最大height
    root.eachBefore(function(node) {
       node.depth = node.parent.depth + 1; --n; 
      }).eachBefore(computeHeight);
    root.parent = null;


    if (n > 0) throw new Error("cycle");

    return root;
  }

  // 参数x表示获得node关键字的get函数
  stratify.id = function(x) {
    return arguments.length ? (id = required(x), stratify) : id;
  };

  // 同理用于获取node的父节点ID的get函数
  stratify.parentId = function(x) {
    return arguments.length ? (parentId = required(x), stratify) : parentId;
  };

  return stratify;
}
