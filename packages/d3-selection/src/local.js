
var nextId = 0;

// 类似于factory函数
export default function local() {
  return new Local;
}

// 构造函数,将ID数值转换为36进制形式并字符串输出
function Local() {
  this._ = "@" + (++nextId).toString(36);
}

// 对每个node节点增加[id]:value形式的键值对
Local.prototype = local.prototype = {
  constructor: Local,
  get: function(node) {
    var id = this._;
    while (!(id in node)) {
      if (!(node = node.parentNode)) return;
    }
    return node[id];
  },
  set: function(node, value) {
    return node[this._] = value;
  },
  remove: function(node) {
    return this._ in node && delete node[this._];
  },
  toString: function() {
    return this._;
  }
};
