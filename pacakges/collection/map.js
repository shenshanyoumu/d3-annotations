// 之所以添加前缀，主要是防止与对象原生属性发生冲突
export var prefix = "$";

function Map() {}

Map.prototype = map.prototype = {
  constructor: Map,
  has: function(key) {
    return prefix + key in this;
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
      if (property[0] === prefix) delete this[property];
  },
  keys: function() {
    var keys = [];
    for (var property in this)
      if (property[0] === prefix) keys.push(property.slice(1));
    return keys;
  },
  values: function() {
    var values = [];
    for (var property in this)
      if (property[0] === prefix) values.push(this[property]);
    return values;
  },
  entries: function() {
    var entries = [];
    for (var property in this)
      if (property[0] === prefix)
        entries.push({ key: property.slice(1), value: this[property] });
    return entries;
  },
  size: function() {
    var size = 0;
    for (var property in this) if (property[0] === prefix) ++size;
    return size;
  },
  empty: function() {
    for (var property in this) if (property[0] === prefix) return false;
    return true;
  },

  // 只对属于map的属性遍历，而不遍历Object的原生属性
  each: function(f) {
    for (var property in this)
      if (property[0] === prefix) {
        f(this[property], property.slice(1), this);
      }
  }
};

// map数据结构，类似Object但是包含更多的操作方法
function map(object, f) {
  var map = new Map();

  if (object instanceof Map)
    object.each(function(value, key) {
      map.set(key, value);
    });
  else if (Array.isArray(object)) {
    var i = -1,
      n = object.length,
      o;

    if (f == null) {
      while (++i < n) map.set(i, object[i]);
    } else {
      while (++i < n) {
        map.set(f((o = object[i]), i, object), o);
      }
    }
  } else {
    if (object) {
      for (var key in object) map.set(key, object[key]);
    }
  }

  return map;
}

export default map;
