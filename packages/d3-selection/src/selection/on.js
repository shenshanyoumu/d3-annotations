var filterEvents = {};

export var event = null;

// 在浏览器环境
if (typeof document !== "undefined") {
  var element = document.documentElement;

  /** in操作符会遍历当前对象及其原型链上对象；
   * 为了兼容不同浏览器对onmouseenter的处理 */
  if (!("onmouseenter" in element)) {
    filterEvents = {
      mouseenter: "mouseover",
      mouseleave: "mouseout"
    };
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  
  return function(event) {
    var related = event.relatedTarget;

    /** DOM方法compareDocumentPositon比较两个节点在DOM树上的相关位置关系 */
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener.call(this, event);
    }
  };
}

/** 
 * 参数listener表示事件监听处理函数，
 * this对象表示当前的DOM元素
 * 在HTML5规范中通过__data__挂载数据 
 * */
function contextListener(listener, index, group) {

  return function(event1) {
    var event0 = event;
    event = event1;
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      event = event0;
    }
  };
}

/** 
 * 在d3.dispatch模块有相同代码，用于处理形如type.name的事件字符串
 * 可以处理相同事件类型不同事件名的监听函数处理
 * */
function parseTypenames(typenames) {
  // 将形如"type1.name1 type2.name2"转换为[{type,name}]形态 
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {

      // 遍历事件监听函数列表，精确匹配[事件类型+事件名]
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        
        // d3底层基于W3C规范，因此可以在现代浏览器上原生兼容
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }

    // i用于判定当前事件监听函数数组的长度，如果为空则说明当前选择集对象没有监听事件
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  
  return function(d, i, group) {
    var on = this.__on, o, listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {

        /** 事件多次添加，需要先移除原来的事件再添加 */
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {type: typename.type, name: typename.name,
       value: value, listener: listener, capture: capture};

    if (!on) this.__on = [o];
    else on.push(o);
  };
}

// 参数value表示事件监听函数，capture表示事件捕捉/冒泡方式
export default function(typename, value, capture) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  // 通过.on(typename,null)形式来移除当前事件名对应的监听函数
  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;

  // 依次注册事件监听器
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
  return this;
}

/** 注意下面event的临时保存，主要是event可重入逻辑 */
export function customEvent(event1, listener, that, args) {
  var event0 = event;
  event1.sourceEvent = event;
  event = event1;
  try {
    return listener.apply(that, args);
  } finally {
    event = event0;
  }
}
