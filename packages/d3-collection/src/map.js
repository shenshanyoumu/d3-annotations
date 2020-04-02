export var prefix = "$";

function Map() {}

// Map表示constructor，map表示factory
Map.prototype = map.prototype = {
  constructor: Map,
  has: function(key) {
    return (prefix + key) in this;
  },
  get: function(key) {
    return this[prefix + key];
  },
  set: function(key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function(key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function() {
    for (var property in this) 
      if (property[0] === prefix) 
      // JS引擎定期GC
      delete this[property];
  },
  keys: function() {
    var keys = [];
    for (var property in this) 
    if (property[0] === prefix) 
    keys.push(property.slice(1));
    return keys;
  },
  values: function() {
    var values = [];
    for (var property in this) 
    if (property[0] === prefix) 
      values.push(this[property]);
    return values;
  },
  entries: function() {
    var entries = [];
    for (var property in this) 
      if (property[0] === prefix) 
        entries.push({
          key: property.slice(1), value: this[property]
        });
    return entries;
  },
  size: function() {
    var size = 0;
    for (var property in this) 
      if (property[0] === prefix) ++size;
    return size;
  },
  empty: function() {
    // 注意 for in遍历对象及原型链上可遍历属性
    for (var property in this) 
      // 包含"$"前缀的属性，则表示Map不为空
      if (property[0] === prefix) return false;
    return true;
  },

  // 对Map对象中前缀"$"属性的visit操作
  each: function(f) {
    for (var property in this)
       if (property[0] === prefix) 
        // 属性值，属性名和上下文对象
        f(this[property], property.slice(1), this);
  }
};

// object表示Map对象/数组，或者普通对象来初始化Map对象，
// f表示访问visitor函数
function map(object, f) {
  var map = new Map;

  // Copy constructor.
  if (object instanceof Map) 
    object.each(function(value, key) {
       map.set(key, value); 
      });

  // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
    var i = -1,
        n = object.length,
        o;

    // 数组索引前置"$"符号作为Map的键
    if (f == null) while (++i < n) map.set(i, object[i]);
    else while (++i < n) 
      map.set(f(o = object[i], i, object), o);
  }

  // 将普通对象转换为Map结构
  else if (object) for (var key in object) 
    map.set(key, object[key]);

  return map;
}

export default map;
