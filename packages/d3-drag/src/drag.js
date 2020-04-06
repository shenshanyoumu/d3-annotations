import {dispatch} from "d3-dispatch";
import {event, customEvent, select, mouse, touch} from "d3-selection";
import nodrag, {yesdrag} from "./nodrag.js";
import noevent, {nopropagation} from "./noevent.js";
import constant from "./constant.js";
import DragEvent from "./event.js";

// Ignore right-click, since that should open the context menu.
// event.button为0表示鼠标左键按下；1表示鼠标中键被按下；2表示鼠标右键被按下
function defaultFilter() {
  // 表示"ctrl"没有被按下，并且鼠标左键被按下
  return !event.ctrlKey && !event.button;
}

// 拖拽容器，默认为当前DOM节点的父节点容器
function defaultContainer() {
  return this.parentNode;
}

// 表示拖拽行为描述对象，在拖拽中实时记录拖拽坐标
function defaultSubject(d) {
  return d == null ? {x: event.x, y: event.y} : d;
}

// ontouchstart属于W3C的事件规范；表示当前DOM规范支持触摸事件
// navigator.maxTouchPoints表示当前设备能够同时支持触摸点的最大数目
// 比如同时支持1、2、3等来进行不同手势操作
function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

export default function() {
  var filter = defaultFilter,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable,

      // 手势行为描述，listeners是自定义的事件监听器。
      // 将鼠标移动/touch动作都统一为下面三种事件类型，方便管理
      gestures = {},
      listeners = dispatch("start", "drag", "end"),

      // 用于判定当前拖拽行为所处的阶段
      // 即是处于拖拽开始，拖拽进行中还是拖拽结束三个阶段的其中之一
      active = 0,

      // 鼠标点击坐标
      mousedownx,
      mousedowny,

      // 鼠标正在移动操作
      mousemoving,

      // 触摸动作进心中
      touchending,

      // 为了区分鼠标是在拖拽移动而不是两次点击行为，需要设置阈值
      clickDistance2 = 0;

   // 下面filter类似ES6的filter操作，表示对touchable事件的支持
 // 只有设备和当前DOM规范支持touchabel，才能执行后续的拖拽移动行为
  function drag(selection) {
    selection
        .on("mousedown.drag", mousedowned)
      .filter(touchable)
        .on("touchstart.drag", touchstarted)
        .on("touchmove.drag", touchmoved)
        .on("touchend.drag touchcancel.drag", touchended)

        // 拖拽中的DOM节点样式设置，便于人类感知该行为
        .style("touch-action", "none")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  // 鼠标按下后，需要监听鼠标的移动和按键恢复动作
  function mousedowned() {
    // 如果当前拖拽行为正在发生，或者当前DOM/设备不支持触摸行为，则直接返回
    if (touchending || !filter.apply(this, arguments)) return;

    // 
    var gesture = beforestart("mouse", 
    container.apply(this, arguments), mouse, this, arguments);


    if (!gesture) return;

    // 鼠标移动事件，以及鼠标按键松开结束移动的事件
    select(event.view)
    .on("mousemove.drag", mousemoved, true)
    .on("mouseup.drag", mouseupped, true);

    // 阻止鼠标拖动事件传播和冒泡
    nodrag(event.view);
    nopropagation();
    mousemoving = false;

    // 记录下鼠标当前坐标
    mousedownx = event.clientX;
    mousedowny = event.clientY;

    // 将鼠标按键按下动作映射为自定义的"start"事件
    gesture("start");
  }

  function mousemoved() {
    noevent();

    // 由于设备按键精度或者存在按键抖动行为
    // clickDistance2用于记录连续两次点击行为的坐标位置变化
    if (!mousemoving) {
      var dx = event.clientX - mousedownx,
       dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }

    // 将鼠标拖拽行为映射为自定义的"drag"事件，这样开发层面不需要关心
    // 底层是由鼠标拖拽还是触控拖拽产生的事件
    gestures.mouse("drag");
  }

  function mouseupped() {
    // 卸载鼠标移动和按键恢复事件监听
    select(event.view)
    .on("mousemove.drag mouseup.drag", null);

    yesdrag(event.view, mousemoving);
    noevent();

    // 将鼠标按键恢复事件映射为自定义的"end"事件
    gestures.mouse("end");
  }

  // 触控行为
  function touchstarted() {
    if (!filter.apply(this, arguments)) return;
    var touches = event.changedTouches,
        c = container.apply(this, arguments),
        n = touches.length, i, gesture;

        // 设备可能同时支持多个触控点
    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(
        touches[i].identifier, c, touch, this, arguments)) {
        nopropagation();
        gesture("start");
      }
    }
  }


  function touchmoved() {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent();
        gesture("drag");
      }
    }
  }

  function touchended() {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation();
        gesture("end");
      }
    }
  }

  function beforestart(id, container, point, that, args) {
    var p = point(container, id), s, dx, dy,
        sublisteners = listeners.copy();

        // 自定义拖拽开始前事件
        // 如果被拖拽DOM对象不存在，则直接返回false
    if (!customEvent(new DragEvent(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function() {
      if ((event.subject = s = subject.apply(that, args)) == null) return false;
      
      // s表示当前拖拽行为，实时记录拖拽对象的坐标
      // dx表示拖拽位移量
      dx = s.x - p[0] || 0;
      dy = s.y - p[1] || 0;
      return true;
    })) return;


    // 对底层拖拽行为的抽象
    return function gesture(type) {
      var p0 = p, n;
      switch (type) {
        // 当监听到拖拽开始事件，则将当前拖拽状态修改为推拽中
        case "start": gestures[id] = gesture, n = active++; break;
        // 当拖拽行为结束，则将当前拖拽状态修改为拖拽开始
        case "end": delete gestures[id], --active; // nobreak
        case "drag": p = point(container, id), n = active; break;
      }

      // 不断生成自定义事件，这些自定义事件对象会被监听函数消费
      customEvent(new DragEvent(
        drag, type, s, id, n, 
        p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], 
        sublisteners), sublisteners.apply, sublisteners,
        [type, that, args]);
    };
  }

  drag.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), drag) : filter;
  };

  drag.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant(_), drag) : container;
  };

  drag.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant(_), drag) : subject;
  };

  drag.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), drag) : touchable;
  };

  // drag对象监听"start"\"drag"和"end"三个自定义事件
  drag.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
}
