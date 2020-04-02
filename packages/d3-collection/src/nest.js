import map from "./map";

export default function() {

  // keys表示形成nest结构的key访问器函数列表。
  // 对于给定的普通数组，根据数组元素[key]进行grouping来形成嵌套结构
  var keys = [],

      //nest结构中非叶子节点的排序器列表，每个排序器对应一个关键字
      sortKeys = [], 
   
      // nest结构中叶子节点的排序器。
      // 注意entry表示为{key:XX,value:xx}，其中value值为数组，因此排序器可以针对数组元素进行排序
      sortValues, 

      // 将nest结构中叶子节点进行合并收缩到父节点
      rollup,

      // 返回给外部使用的nest对象
      nest;

  
  /**
   * 
   * @param {*} array 普通数组
   * @param {*} depth 参与grouping的keys数目，用于层次化递归
   * @param {*} createResult nest对象的底层数据结构，比如object或者Map
   * @param {*} setResult nest对象设置键值对
   */
  function apply(array, depth, createResult, setResult) {

    // 对于叶子结点，可以进行排序或者聚合收缩
    if (depth >= keys.length) {
      if (sortValues != null) array.sort(sortValues);
      return rollup != null ? rollup(array) : array;
    }

    var i = -1,
        n = array.length,
        key = keys[depth++],
        keyValue,
        value,
        valuesByKey = map(),
        values,
        result = createResult();

    // 参数n在每一轮的嵌套化处理中都是不一样的，比如第一轮处理的n表示原始数组长度
    // 第二轮嵌套化处理中，n表示经过第一个key访问器grouping的数组
    while (++i < n) {
      // 根据给定的key关键字，返回Map对象对应的values值，注意values可能是数组。
      // 因为在经过一次key的嵌套化处理后，总会grouping一些数组元素。即这组数组元素的key内容一致
      if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
        values.push(value);
      } else {
        // 针对未被grouping的数组元素，直接设置为Map的键值对，等待后续被grouping
        valuesByKey.set(keyValue, [value]);
      }
    }

    // 递归进行嵌套化处理，最终返回嵌套数组。
    valuesByKey.each(function(values, key) {
      setResult(result, key, apply(values, depth, createResult, setResult));
    });

    return result;
  }

  /**
   * 
   * @param {*} map 
   * @param {*} depth 表示对keys访问器列表的处理，从第一个key访问器处理到最后一个key访问器
   */
  function entries(map, depth) {
    if (++depth > keys.length) return map;

    // Nest结构中非叶子节点排序器列表，sortKeys[depth-1]表示最底层非叶子节点排序函数
    var array, sortKey = sortKeys[depth - 1];

    // Map对象中的键值对转换为entries结构数组
    if (rollup != null && depth >= keys.length) array = map.entries();
    else {
      // 递归entries，将嵌套树形结构转换为嵌套的entries结构
      array = [], map.each(function(v, k) { 
        array.push({key: k, values: entries(v, depth)}); });
    }

    // 在递归过程中，每一次递归形成嵌套层，并对该嵌套层节点进行排序
    return sortKey != null ? array.sort(function(a, b) { 
      return sortKey(a.key, b.key); }) : array;
  }

  return nest = {
    object: function(array) { 
      return apply(array, 0, createObject, setObject); },

    map: function(array) { 
      return apply(array, 0, createMap, setMap); 
    },

    entries: function(array) {
       return entries(apply(array, 0, createMap, setMap), 0); 
      },

    // 声明式添加一个key访问器函数，并返回this上下文
    key: function(d) { 
      keys.push(d); 
    return nest; },
   
    // 嵌套对象非叶子节点可以根据key值来进行排序
    sortKeys: function(order) { 
      sortKeys[keys.length - 1] = order; return nest; 
    },

    // 嵌套对象叶子节点根据value值进行排序
    sortValues: function(order) { 
      sortValues = order; return nest; 
    },

    // nest对象可以多次添加rollup访问器，用于对叶子节点开始不断迭代聚合
    rollup: function(f) { 
      rollup = f; return nest; 
    }
  };
}


function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return map();
}

function setMap(map, key, value) {
  map.set(key, value);
}
