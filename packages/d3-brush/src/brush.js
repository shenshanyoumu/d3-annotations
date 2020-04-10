import {dispatch} from "d3-dispatch";

/** d3-drag屏蔽底层的鼠标拖拽或者触摸拖拽实现，统一对外输出
 * 类似react框架的事件机制一样，屏蔽底层实现
 */
import {
  dragDisable, 
  dragEnable} from "d3-drag";
import {interpolate} from "d3-interpolate";

// 基于DOM规范的选择器模块
import {customEvent, event, 
  touch, mouse, select} from "d3-selection";

import {interrupt} from "d3-transition";
import constant from "./constant.js";
import BrushEvent from "./event.js";
import noevent, {nopropagation} from "./noevent.js";

var MODE_DRAG = {name: "drag"},
    MODE_SPACE = {name: "space"},
    MODE_HANDLE = {name: "handle"},
    MODE_CENTER = {name: "center"};

// 一维区间
function number1(e) {
  return [+e[0], +e[1]];
}

// 二维区间
function number2(e) {
  return [number1(e[0]), number1(e[1])];
}

// identifier表示触摸事件中标识触摸类型的标识符；
// target表示触摸的DOM容器；event.touches是遵循JS规范的触摸事件对象
function toucher(identifier) {
  return function(target) {
    return touch(target, event.touches, identifier);
  };
}

// 定义brush左右刷动的行为
var X = {
  name: "x",
  // 表示向右、向左的brush动作
  handles: ["w", "e"].map(type),
  // e参数表示extent二维区间数组，x表示刷子在X轴向的区间
  input: function(x, e) { 
    return x == null ? null : [[+x[0], e[0][1]], [+x[1], e[1][1]]]; 
  },
  // xy表示二维区间数组，返回brush在X轴向的区间范围
  output: function(xy) { 
    return xy && [xy[0][0], xy[1][0]]; 
  }
};

// 与X同理
var Y = {
  name: "y",
  handles: ["n", "s"].map(type),
  input: function(y, e) { 
    return y == null ? null : [[e[0][0], +y[0]], [e[1][0], +y[1]]]; },
  output: function(xy) { 
    return xy && [xy[0][1], xy[1][1]]; 
  }
};

// 表示二维brush动作，则可以从八个方位进行brush
var XY = {
  name: "xy",
  handles: ["n", "w", "e", "s", "nw", "ne", "sw", "se"].map(type),
  input: function(xy) { 
    return xy == null ? null : number2(xy); },
  output: function(xy) { return xy; }
};

// 下面都是符合CSS规范的标准光标样式
var cursors = {
  overlay: "crosshair",
  selection: "move",
  n: "ns-resize",
  e: "ew-resize",
  s: "ns-resize",
  w: "ew-resize",
  nw: "nwse-resize",
  ne: "nesw-resize",
  se: "nwse-resize",
  sw: "nesw-resize"
};

// 基于Y轴的方位翻转
var flipX = {
  e: "w",
  w: "e",
  nw: "ne",
  ne: "nw",
  se: "sw",
  sw: "se"
};

// 基于X轴的方位翻转
var flipY = {
  n: "s",
  s: "n",
  nw: "sw",
  ne: "se",
  se: "ne",
  sw: "nw"
};

// 
var signsX = {
  overlay: +1,
  selection: +1,
  n: null,
  e: +1,
  s: null,
  w: -1,
  nw: -1,
  ne: +1,
  se: +1,
  sw: -1
};

var signsY = {
  overlay: +1,
  selection: +1,
  n: -1,
  e: null,
  s: +1,
  w: null,
  nw: -1,
  ne: -1,
  se: +1,
  sw: +1
};

// 参数t表示brush的方向枚举，比如E、W、N、S方位
function type(t) {
  return {type: t};
}

// brush事件过滤掉Ctrl按键行为，以及鼠标中键、右键点击行为
// 因为鼠标中键、右键点击行为可能会被用于唤起contextMenu
function defaultFilter() {
  return !event.ctrlKey && !event.button;
}

// brush默认扫过的二维区间
function defaultExtent() {
  // this表示brush操作的DOM节点，ownerSVGElement指向当前DOM节点的最近祖先<svg>元素
  // 如果this本身为SVG，则ownerSVGEleement返回null
  var svg = this.ownerSVGElement || this;

  // 用于浏览器兼容性处理，svg.viewBox定义了SVG元素相对父节点的定位和本身宽高尺寸
  if (svg.hasAttribute("viewBox")) {
    svg = svg.viewBox.baseVal;

    // [svg.x,svg.y]表示SVG元素在当前viewport的左上角位置
    return [[svg.x, svg.y], [svg.x + svg.width, svg.y + svg.height]];
  }

  // 默认从viewport的左上角
  return [[0, 0], [svg.width.baseVal.value, svg.height.baseVal.value]];
}

// 判定设备是否支持触控
function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

// Like d3.local, but with the name “__brush” rather than auto-generated.
// 从子DOM向上递归，直到最外层具有brush属性的DOM节点，返回容器节点的brush对象
function local(node) {
  while (!node.__brush) 
    if (!(node = node.parentNode)) return;
 
  return node.__brush;
}

// 没有进行brush操作
function empty(extent) {
  return extent[0][0] === extent[1][0]
      || extent[0][1] === extent[1][1];
}

// node表示进行brush动作的DOM容器节点，返回所有被brush覆盖的后代DOM集合
// 比如图表容器为<svg>，被brush覆盖的是一系列<g>标签
export function brushSelection(node) {
  var state = node.__brush;
  return state ? state.dim.output(state.selection) : null;
}

// 在X轴向的刷动操作
export function brushX() {
  return brush(X);
}

// 在Y轴向的刷动操作
export function brushY() {
  return brush(Y);
}

// 二维空间的刷动
export default function() {
  return brush(XY);
}

// brush刷动的本质，其实就是得到被brush覆盖的DOM集合、brush的范围
// 以及针对brush事件的事件监听处理，比如进行缩放、平移等(本质上修改scale定义域和值域的映射关系)
function brush(dim) {

  // 默认brush刷动区间、对键盘/鼠标特殊按键事件的过滤，
  // 以及判定当前设备/DOM规范是否支持触控
  var extent = defaultExtent,
      filter = defaultFilter,
      touchable = defaultTouchable,

    
      keys = true,

      // 对外提供的三个事件类型，屏蔽底层实现
      listeners = dispatch("start", "brush", "end"),

      // 表示刷子刷动操作时光标的尺寸
      handleSize = 6,
      touchending;

  // group表示选择集，题外话DOM对象的property，以及HTML标签的attribute
  function brush(group) {
    var overlay = group
        .property("__brush", initialize)
      .selectAll(".overlay")
      .data([type("overlay")]);

      // enter()动作用于数据集和DOM集合的一一绑定
      // 
    overlay.enter().append("rect")
        .attr("class", "overlay")
        .attr("pointer-events", "all")
        .attr("cursor", cursors.overlay)
      .merge(overlay)
        .each(function() {
          // this表示选择集中每个DOM对象，local(this)返回包含_brush属性的容器DOM节点
          // 下面之所以针对选择集中每个DOM进行local(this)操作，是因为d3-selection支持
          // 多个选择集同时操作，即可以通过brush操作得到多个选择区域
          var extent = local(this).extent;
          select(this)
              .attr("x", extent[0][0])
              .attr("y", extent[0][1])
              .attr("width", extent[1][0] - extent[0][0])
              .attr("height", extent[1][1] - extent[0][1]);
        });

    // 对进行brush操作的选择集覆盖一层样式，在视觉上表示当前的行为
    group.selectAll(".selection")
      .data([type("selection")])
      .enter().append("rect")
        .attr("class", "selection")
        .attr("cursor", cursors.selection)
        .attr("fill", "#777")
        .attr("fill-opacity", 0.3)
        .attr("stroke", "#fff")
        .attr("shape-rendering", "crispEdges");

    // handle选择集表示当前的brush操作，比如当brush先沿着X轴进行刷动
    // 然后沿着Y轴进行刷动，则需要清除之前X轴刷动的覆盖层样式
    var handle = group.selectAll(".handle")
      .data(dim.handles, function(d) { return d.type; });

    handle.exit().remove();

    // 设置刷动过程中光标样式
    handle.enter().append("rect")
        .attr("class", function(d) { 
          return "handle handle--" + d.type; 
        })
        .attr("cursor", function(d) {
           return cursors[d.type]; 
        });


    // 对选择集绑定刷动相关的事件
    // 注意下面"EventType.eventName"的字符串形式，会被d3-selection模块处理
    // redraw函数作用于选择集中每个DOM节点，用于处理刷动逻辑的绘制过程

    // 注意下面d3-selection模块监听原生的鼠标或触控事件，然后在事件监听器中
    // 进行原生事件的统一抽象，并对外提供钩子挂载事件处理器。这是一个比较复杂的过程
    group
        .each(redraw)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mousedown.brush", started)
      .filter(touchable)
        .on("touchstart.brush", started)
        .on("touchmove.brush", touchmoved)
        .on("touchend.brush touchcancel.brush", touchended)
        .style("touch-action", "none")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  // group表示基于d3-selection模块的选择集；
  // selection表示被brush刷子刷过的区间数组
  brush.move = function(group, selection) {
    if (group.selection) {
      group
          .on("start.brush", function() { 
            emitter(this, arguments).beforestart().start(); 
          })
          .on("interrupt.brush end.brush", function() { 
            emitter(this, arguments).end();
           })

          //  在start.brush和end.brush之间的补间动画
          .tween("brush", function() {

            // this对象表示group选择集，that.__brush表示当前DOM容器的brush对象
            var that = this,
                state = that.__brush,
                emit = emitter(that, arguments),

                // selection0和selection1表示刷动extent范围
                selection0 = state.selection,

                // dim表示X、Y或者XY三个刷动方位对象，dim.input表示刷子结束的extent数组
                selection1 = dim.input(typeof
                   selection === "function" ? selection.apply(this, arguments) : 
                   selection, state.extent),

                  //  interpolate是一个高阶函数，执行后返回真正的插值器
                i = interpolate(selection0, selection1);

            function tween(t) {
              state.selection = t === 1 && selection1 === null ? null : i(t);
              
              
              redraw.call(that);
              emit.brush();
            }
           
            // 两次刷动操作之间的补间动画
            return selection0 !== null && selection1 !== null ? tween : tween(1);
          });
    } else {

      // 如果当前选择集没有被brush过
      group
          .each(function() {
            var that = this,
                args = arguments,
                state = that.__brush,
                selection1 = dim.input(typeof
                   selection === "function" ? 
                   selection.apply(that, args) : selection, state.extent),
               
                   emit = emitter(that, args).beforestart();

            interrupt(that);
            state.selection = selection1 === null ? null : selection1;
           
            // redraw
            redraw.call(that);
            emit.start().brush().end();
          });
    }
  };

  // 清除brush区域，
  brush.clear = function(group) {
    brush.move(group, null);
  };

  // 下面参数this表示原始选择集中某个DOM节点，
  function redraw() {

     // select(this)返回该DOM节点包含的后代选择集
    var group = select(this),

        // local(this)返回包含_brush属性的最近祖先DOM容器的_brush属性对象
        // 下面selection其实就是参与brush刷动的DOM选择集
        selection = local(this).selection;

        // 表示被刷子刷动区间包含的选择集，selection一般为group的子集
    if (selection) {
    
      // 注意display和visibility的样式差异，
      // display:none则DOM节点从DOM树移除
      // 下面操作中会创建一组不在DOM树上的DOM节点对象
      group.selectAll(".selection")
          .style("display", null)
          .attr("x", selection[0][0])
          .attr("y", selection[0][1])
          .attr("width", selection[1][0] - selection[0][0])
          .attr("height", selection[1][1] - selection[0][1]);

      // 刷子刷动过程中控制面板设置
      group.selectAll(".handle")
          .style("display", null)
          .attr("x", function(d) { 
            // 注意参数d.type表示形如"e"、"ne"、"se"等字符串
            // 表示刷动的方位描述，因此下面的代码很容易理解，
            // 目的是将刷动光标定位到合理的坐标位置
            return d.type[d.type.length - 1] === "e" ? 
            selection[1][0] - handleSize / 2 : 
            selection[0][0] - handleSize / 2; })

          .attr("y", function(d) {
             return d.type[0] === "s" ? selection[1][1] - handleSize / 2 : 
             selection[0][1] - handleSize / 2; })

          // 当刷动方向在上下方位，设置刷动控制面板宽度
          .attr("width", function(d) { 
            return d.type === "n" || d.type === "s" ?
             selection[1][0] - selection[0][0] + handleSize : 
             handleSize; })

          .attr("height", function(d) {
             return d.type === "e" || d.type === "w" ?
              selection[1][1] - selection[0][1] + handleSize :
               handleSize; });
    }

    else {
    
      // 如果刷子刷动区域不包含this节点及其后代DOM选择集
      // 则将图表中已刷新覆盖层样式移除、并且移除刷动面板样式
      group.selectAll(".selection,.handle")
          .style("display", "none")
          .attr("x", null)
          .attr("y", null)
          .attr("width", null)
          .attr("height", null);
    }
  }

  // 如果当前DOM容器节点已经存在Emitter对象属性，并且没有被当做失效处理，则直接使用
  // 否则返回一个新的Emitter对象，这个对象会被brush事件对象传递给事件监听器
  function emitter(that, args, clean) {
    return (!clean && that.__brush.emitter) || new Emitter(that, args);
  }

  // Emitter是一个基于pub/sub机制的事件总线

  // 注意__brush属性挂载在选择集的容器DOM上
  // that表示特定的DOM节点
  function Emitter(that, args) {
    this.that = that;
    this.args = args;
    this.state = that.__brush;
    this.active = 0;
  }

  // Emitter事件总线提供一些列hooks来监听处理brush的一些列操作
  Emitter.prototype = {
    beforestart: function() {
      if (++this.active === 1) 
        this.state.emitter = this, this.starting = true;
      return this;
    },
    start: function() {
      if (this.starting) this.starting = false, this.emit("start");
      else this.emit("brush");
      return this;
    },
    brush: function() {
      this.emit("brush");
      return this;
    },
    end: function() {
      if (--this.active === 0) 
        delete this.state.emitter, this.emit("end");
      return this;
    },
    // 事件分发逻辑
    emit: function(type) {
      customEvent(new BrushEvent(brush, type, 
        dim.output(this.state.selection)),
         listeners.apply, 
         listeners, 
         [type, this.that, this.args]);
    }
  };

  // 监听鼠标或者触控动作
  function started() {
    if (touchending && !event.touches) return;
    if (!filter.apply(this, arguments)) return;

    // this是选择集对象
    var that = this,
        type = event.target.__data__.type,
        mode = (keys && event.metaKey ? type = "overlay" : type) === "selection" ? 
        MODE_DRAG : (keys && event.altKey ? MODE_CENTER : MODE_HANDLE),

        signX = dim === Y ? null : signsX[type],
        signY = dim === X ? null : signsY[type],
        state = local(that),

        // 注意extent和selection的差别，虽然两者都表示刷动范围
        // extent表示图表中刷动遮罩层的左上角和右下角坐标数组；
        // selection的含义？？
        extent = state.extent,
        selection = state.selection,
        W = extent[0][0], w0, w1,
        N = extent[0][1], n0, n1,
        E = extent[1][0], e0, e1,
        S = extent[1][1], s0, s1,
        dx = 0,
        dy = 0,
        moving,
        shifting = signX && signY && keys && event.shiftKey,
        lockX,
        lockY,
        pointer = event.touches ? toucher(event.changedTouches[0].identifier) : mouse,
        point0 = pointer(that),
        point = point0,
        emit = emitter(that, arguments, true).beforestart();

    if (type === "overlay") {
      if (selection) moving = true;
      state.selection = selection = [
        [w0 = dim === Y ? W : point0[0], n0 = dim === X ? N : point0[1]],
        [e0 = dim === Y ? E : w0, s0 = dim === X ? S : n0]
      ];
    } else {
      w0 = selection[0][0];
      n0 = selection[0][1];
      e0 = selection[1][0];
      s0 = selection[1][1];
    }

    w1 = w0;
    n1 = n0;
    e1 = e0;
    s1 = s0;

    var group = select(that)
        .attr("pointer-events", "none");

    var overlay = group.selectAll(".overlay")
        .attr("cursor", cursors[type]);

        // 如果设备或者DOM规范支持触控，则在JS的event事件对象中包含该属性
    if (event.touches) {
      emit.moved = moved;
      emit.ended = ended;
    } else {
      var view = select(event.view)
          .on("mousemove.brush", moved, true)
          .on("mouseup.brush", ended, true);
      if (keys) view
          .on("keydown.brush", keydowned, true)
          .on("keyup.brush", keyupped, true)

      dragDisable(event.view);
    }

    nopropagation();
    interrupt(that);
    redraw.call(that);
    emit.start();

    function moved() {
      var point1 = pointer(that);
      if (shifting && !lockX && !lockY) {
        if (Math.abs(point1[0] - point[0]) > Math.abs(point1[1] - point[1])) lockY = true;
        else lockX = true;
      }
      point = point1;
      moving = true;
      noevent();
      move();
    }

    function move() {
      var t;

      dx = point[0] - point0[0];
      dy = point[1] - point0[1];

      switch (mode) {
        case MODE_SPACE:
        case MODE_DRAG: {
          if (signX) dx = Math.max(W - w0, Math.min(E - e0, dx)), w1 = w0 + dx, e1 = e0 + dx;
          if (signY) dy = Math.max(N - n0, Math.min(S - s0, dy)), n1 = n0 + dy, s1 = s0 + dy;
          break;
        }
        case MODE_HANDLE: {
          if (signX < 0) dx = Math.max(W - w0, Math.min(E - w0, dx)), w1 = w0 + dx, e1 = e0;
          else if (signX > 0) dx = Math.max(W - e0, Math.min(E - e0, dx)), w1 = w0, e1 = e0 + dx;
          if (signY < 0) dy = Math.max(N - n0, Math.min(S - n0, dy)), n1 = n0 + dy, s1 = s0;
          else if (signY > 0) dy = Math.max(N - s0, Math.min(S - s0, dy)), n1 = n0, s1 = s0 + dy;
          break;
        }
        case MODE_CENTER: {
          if (signX) w1 = Math.max(W, Math.min(E, w0 - dx * signX)), e1 = Math.max(W, Math.min(E, e0 + dx * signX));
          if (signY) n1 = Math.max(N, Math.min(S, n0 - dy * signY)), s1 = Math.max(N, Math.min(S, s0 + dy * signY));
          break;
        }
      }

      if (e1 < w1) {
        signX *= -1;
        t = w0, w0 = e0, e0 = t;
        t = w1, w1 = e1, e1 = t;
        if (type in flipX) overlay.attr("cursor", cursors[type = flipX[type]]);
      }

      if (s1 < n1) {
        signY *= -1;
        t = n0, n0 = s0, s0 = t;
        t = n1, n1 = s1, s1 = t;
        if (type in flipY) overlay.attr("cursor", cursors[type = flipY[type]]);
      }

      if (state.selection) selection = state.selection; // May be set by brush.move!
      if (lockX) w1 = selection[0][0], e1 = selection[1][0];
      if (lockY) n1 = selection[0][1], s1 = selection[1][1];

      if (selection[0][0] !== w1
          || selection[0][1] !== n1
          || selection[1][0] !== e1
          || selection[1][1] !== s1) {
        state.selection = [[w1, n1], [e1, s1]];
        redraw.call(that);
        emit.brush();
      }
    }

    function ended() {
      nopropagation();
      if (event.touches) {
        if (event.touches.length) return;
        if (touchending) clearTimeout(touchending);
        touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
      } else {
        dragEnable(event.view, moving);
        view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
      }
      group.attr("pointer-events", "all");
      overlay.attr("cursor", cursors.overlay);
      if (state.selection) selection = state.selection; // May be set by brush.move (on start)!
      if (empty(selection)) state.selection = null, redraw.call(that);
      emit.end();
    }

    function keydowned() {
      switch (event.keyCode) {
        case 16: { // SHIFT
          shifting = signX && signY;
          break;
        }
        case 18: { // ALT
          if (mode === MODE_HANDLE) {
            if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
            if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
            mode = MODE_CENTER;
            move();
          }
          break;
        }
        case 32: { // SPACE; takes priority over ALT
          if (mode === MODE_HANDLE || mode === MODE_CENTER) {
            if (signX < 0) e0 = e1 - dx; else if (signX > 0) w0 = w1 - dx;
            if (signY < 0) s0 = s1 - dy; else if (signY > 0) n0 = n1 - dy;
            mode = MODE_SPACE;
            overlay.attr("cursor", cursors.selection);
            move();
          }
          break;
        }
        default: return;
      }
      noevent();
    }

    function keyupped() {
      switch (event.keyCode) {
        case 16: { // SHIFT
          if (shifting) {
            lockX = lockY = shifting = false;
            move();
          }
          break;
        }
        case 18: { // ALT
          if (mode === MODE_CENTER) {
            if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
            if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
            mode = MODE_HANDLE;
            move();
          }
          break;
        }
        case 32: { // SPACE
          if (mode === MODE_SPACE) {
            if (event.altKey) {
              if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
              if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
              mode = MODE_CENTER;
            } else {
              if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
              if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
              mode = MODE_HANDLE;
            }
            overlay.attr("cursor", cursors[type]);
            move();
          }
          break;
        }
        default: return;
      }
      noevent();
    }
  }

  function touchmoved() {
    emitter(this, arguments).moved();
  }

  // 参数this表示DOM对象，该DOM对象具有__brush属性，用于描述当前元素被刷动过的状态
  function touchended() {
    emitter(this, arguments).ended();
  }

  // dim对象定义brush操作方位是一维还是二维
  // 下面this对象一般指代brush对象
  function initialize() {
    var state = this.__brush || {selection: null};
    // extent.apply(this.arguments)其实就是调用brush.extent(arguments)
    state.extent = number2(extent.apply(this, arguments));
    state.dim = dim;
    return state;
  }

  // extent表示刷动区间，注意下面brush.extent()参数会默认转换为函数
  brush.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : 
    constant(number2(_)), brush) : extent;
  };

  // 过滤掉默认行为，比如按下Ctrl键后，则brush动作失效
  brush.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : 
    constant(!!_), brush) : filter;
  };

  // 用于指示当前设备或DOM规范是否支持触控操作
  brush.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ :
     constant(!!_), brush) : touchable;
  };

  brush.handleSize = function(_) {
    return arguments.length ? (handleSize = +_, brush) : handleSize;
  };

  // 表示辅助按键，比如shift、Ctrl、Alt等
  brush.keyModifiers = function(_) {
    return arguments.length ? (keys = !!_, brush) : keys;
  };

  // 监听brush动作，比如start、brush和end三个动作类型
  brush.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? brush : value;
  };

  return brush;
}
