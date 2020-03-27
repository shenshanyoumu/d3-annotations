import {path} from "d3-path";
import circle from "./symbol/circle.js";
import cross from "./symbol/cross.js";
import diamond from "./symbol/diamond.js";
import star from "./symbol/star.js";
import square from "./symbol/square.js";
import triangle from "./symbol/triangle.js";
import wye from "./symbol/wye.js";
import constant from "./constant.js";

export var symbols = [
  circle,
  cross,
  diamond,
  square,
  star,
  triangle,
  wye
];

export default function() {
  /** 默认为圆圈符号，开发者可选择其他基础符号 */
  var type = constant(circle),
      size = constant(64),
      context = null;

  function symbol() {
    var buffer;
    /** 如果没有绘制画布，比如SVG或者canvas，则将上下文对象赋值为路径生成器对象 */
    if (!context) context = buffer = path();
    
    /** 将给定的符号对象“绘制”到context上，并返回具有相同引用的buffer对象 */
    type.apply(this, arguments).draw(context, +size.apply(this, arguments));
    if (buffer) return context = null, buffer + "" || null;
  }

  symbol.type = function(_) {
    return arguments.length ? (type = typeof _ === "function" ? _ : constant(_), symbol) : type;
  };

  symbol.size = function(_) {
    return arguments.length ? (size = typeof _ === "function" ? _ : constant(+_), symbol) : size;
  };

  symbol.context = function(_) {
    return arguments.length ? (context = _ == null ? null : _, symbol) : context;
  };

  return symbol;
}
