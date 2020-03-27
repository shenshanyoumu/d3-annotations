import {Selection} from "./index";
import {EnterNode} from "./enter";
import constant from "../constant";

// 对
var keyPrefix = "$"; // Protect against keys like “__proto__”.

// 核心方法，控制DOM节点的增删该逻辑
function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,

      // 注意groupLength表示选择集大小，而dataLength表示data()绑定的数据集大小。
      // 通过两者的大小比较，来指导enter、exit操作
      groupLength = group.length,
      dataLength = data.length;

  // 对选择集中原有节点进行数据更新；对需要新增节点创建EnterNode对象
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // 如果存在未匹配data的节点，则需要进行移除操作。注意for循环索引i是函数作用域
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

/**
 * 
 * @param {*} parent 
 * @param {*} group 
 * @param {*} enter 
 * @param {*} update 
 * @param {*} exit 
 * @param {*} data 
 * @param {*} key 
 */
function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
      exit[i] = node;
    }
  }
}

/**
 *  data()函数的参数一般为数组
 * @param {*} value 一般为迭代器函数，对数组对象的迭代
 * @param {*} key 如果数组元素显示设置key,则使用；否则默认为数组元素的index
 * 与react的VDOM渲染优化一样，通过为数据引入key可以快速操作DOM树
 */
export default function(value, key) {
  if (!value) {
    // 如果参数为空，则表示不进行实际的enter和exit操作；并返回当前选择集数据
    data = new Array(this.size()), j = -1;
    this.each(function(d) { data[++j] = d; });
    return data;
  }

  // 如果外部key最好，没有则降级为数组的索引
  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant(value);

  // 知识点：用var声明的变量进行hoist，因此在for循环外部可以引用enter对象
  for (var m = groups.length, update = new Array(m), enter = new Array(m), 
  exit = new Array(m), j = 0; j < m; ++j) {

    // 通过大量的源码可以推导出，_groups数组中每个元素为一个选择集；而_parents与选择集一一对应
    // 即一个parent对应一个选择集
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,

        // 外部参数value作为迭代器函数，进行迭代遍历
        data = value.call(parent, parent && parent.__data__, j, parents),
        
        // 在任何一个时间切面，DOM结构由三部分构成，即新增加的节点、原有继续存在的节点，以及需要被删除的节点
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  // 核心代码，将enter节点集和exit的节点集和挂载到update选择器对象上。
  // 代码中通过update()来触发DOM的增删改逻辑
  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}
