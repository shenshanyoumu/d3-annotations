import {path} from "d3-path";
import {slice} from "../array.js";
import constant from "../constant.js";
import {x as pointX, y as pointY} from "../point.js";
import pointRadial from "../pointRadial.js";

// 在绘制桑基图也需要Link，表示两个节点直接的连线
function linkSource(d) {
  return d.source;
}

function linkTarget(d) {
  return d.target;
}

// 参数curve表示曲线generator
function link(curve) {
  var source = linkSource,
      target = linkTarget,
      x = pointX,
      y = pointY,
      context = null;

  function link() {
    var buffer, argv = slice.call(arguments),
     s = source.apply(this, argv),
     t = target.apply(this, argv);
    if (!context) context = buffer = path();
    curve(context, +x.apply(this, (argv[0] = s, argv)), 
    +y.apply(this, argv), 
    +x.apply(this, (argv[0] = t, argv)), 
    +y.apply(this, argv));

    if (buffer) return context = null, buffer + "" || null;
  }

  // Link曲线的源节点函数
  link.source = function(_) {
    return arguments.length ? (source = _, link) : source;
  };

  link.target = function(_) {
    return arguments.length ? (target = _, link) : target;
  };

  link.x = function(_) {
    return arguments.length ? 
    (x = typeof _ === "function" ? _ : constant(+_), link) : x;
  };

  link.y = function(_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : constant(+_), link) : y;
  };

  // 绘制画布对象，比如SVG或者canvas
  link.context = function(_) {
    return arguments.length ? 
    ((context = _ == null ? null : _), link) : context;
  };

  return link;
}

// 如果直接连接[x0,y0]和[x1,y1]则在视觉呈现上不优雅
// 通过在[x0,y0]和[x1,y1]中间补点，并基于贝塞尔曲线绘制来优化视觉效果
function curveHorizontal(context, x0, y0, x1, y1) {
  context.moveTo(x0, y0);
  context.bezierCurveTo(x0 = (x0 + x1) / 2, y0, x0, y1, x1, y1);
}

// 作图法来理解下面的视觉效果，注意与curveHorizontal的区别
function curveVertical(context, x0, y0, x1, y1) {
  context.moveTo(x0, y0);
  context.bezierCurveTo(x0, y0 = (y0 + y1) / 2, x1, y0, x1, y1);
}

// 参数中x0、x1表示极坐标的弧度；y0、y1表示极坐标的半径
// 用于绘制类"S"的曲线，
function curveRadial(context, x0, y0, x1, y1) {
  var p0 = pointRadial(x0, y0),
      p1 = pointRadial(x0, y0 = (y0 + y1) / 2),
      p2 = pointRadial(x1, y0),
      p3 = pointRadial(x1, y1);
  context.moveTo(p0[0], p0[1]);
  context.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
}

export function linkHorizontal() {
  return link(curveHorizontal);
}

export function linkVertical() {
  return link(curveVertical);
}

// 针对极坐标形式的转化
export function linkRadial() {
  var l = link(curveRadial);
  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;
  return l;
}
