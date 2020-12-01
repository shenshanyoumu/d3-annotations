/**
 * 默认的匿名事件对象，value存放该事件的回调函数
 */
var noop = {value: function() {}};

// 初始化事件分发器，参数为事件类型列表。注意事件名不能有空格和"."符号
function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    /** 下面表示事件类型type不能为空 */
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) 
      throw new Error("illegal type: " + t);
   
    /** 下面的含义是同一个事件类型可以存储多个回调函数 */
    _[t] = [];
  }
  
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

/**
 * 
 * @param {*} typenames 进行事件分发的事件集合，可以用"|"或者空格分隔
 * @param {*} types dispatch事件分发器支持的所有事件类型
 */
function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {

    /** 在进行事件分发时，可以将事件类型和事件名进行组合，形如"eventType.eventName" */
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);

    /** 分发未知事件类型，则直接抛错 */
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,

  /** 进行事件注册,回调函数可选 */
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length; //T数组表示待分发的事件对象集

     /** 
      * 事件注册时没有传递回调函数，则遍历事件类型关联的回调函数列表。查看是否已存在
      * 同事件名的回调函数注册，如果有则返回该回调函数
      */
    if (arguments.length < 2) {
      while (++i < n) {
        if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) 
        return t;
      }
    
      return;
    }

    /** 回调函数必须是函数 */
    if (callback != null && typeof callback !== "function") 
      throw new Error("invalid callback: " + callback);
    
    while (++i < n) {

      /** 如何当前事件的回调存在，则对dispatch对象相应事件类型进行覆盖性注册 */
      if (t = (typename = T[i]).type) {
        _[t] = set(_[t], typename.name, callback);
      }
       
      /** 下面的逻辑，其实就是解绑已经注册过的事件对象 */
      else if (callback == null) {
        for (t in _) 
          _[t] = set(_[t], typename.name, null);
      }

    }

    return this;
  },

  /** 将dispatch分发器进行复制，其基本操作就是复制事件类型及其关联的回调函数列表 */
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },

  /** call方式分发事件，第一个参数为事件类型；第二个参数为执行上下文对象；
   *  多余参数为事件回调函数的操作
   */
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) {
      for (var args = new Array(n), i = 0, n, t; i < n; ++i) 
        args[i] = arguments[i + 2];
    }
      
    /** 事件类型type之前没有注册过，则调用时抛错 */
    if (!this._.hasOwnProperty(type)) 
      throw new Error("unknown type: " + type);
    
    // t[i].value表示特定事件类型对应的第i个回调函数
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) 
      t[i].value.apply(that, args);
  },

  /** 与call操作类似 */
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) 
      t[i].value.apply(that, args);
  }
};

/**
 * 返回给定事件类型下，特定的事件名称对应的回调函数
 * @param {*} type 表示事件类型，其value为数组保存该类事件的所有事件对象
 * @param {*} name 表示特定事件类型下的事件名称
 */
function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

/**
 * 在dispatch事件分发器中保存特定事件对象
 * @param {*} type 特定事件类型所关联的回调函数列表
 * @param {*} name 特定事件类型下的事件名称
 * @param {*} callback 该事件类型关联的回调函数
 */
function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {

    /** 如果该事件类型的回调函数列表中已经存在同名事件的回调，则需要先剔除 */
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }

  /** 事件存在回调函数，则将该事件保存到dispatch对象 */
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

export default dispatch;
