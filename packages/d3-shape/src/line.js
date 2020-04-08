import {path} from "d3-path";
import constant from "./constant.js";
import curveLinear from "./curve/linear.js";
import {x as pointX, y as pointY} from "./point.js";

export default function() {
  // x,y表示坐标生成函数，而不是坐标点
  var x = pointX,
      y = pointY,
      defined = constant(true),
      context = null,

      // 之所有需要引入curveLinear生成器，而不是直接对坐标点列表进行处理
      // 主要是提供一种策略模式，来指示坐标点的连接方式很多
      // 从最基本的坐标点间线段连接，到各种曲线平滑手段，都是通过curve生成器
      curve = curveLinear,
      output = null;

      // data表示坐标点列表
  function line(data) {
    var i,
        n = data.length,
        d,
        defined0 = false,
        buffer;

    // 注意d3-path输出字符串，字符串用于描述svg的绘制过程
    if (context == null) 
      output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();
        else output.lineEnd();
      }
    if (defined0) {
      
      output.point(+x(d, i, data), +y(d, i, data));
    }    
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  line.x = function(_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : constant(+_), line) : x;
  };

  line.y = function(_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : constant(+_), line) : y;
  };

  line.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), line) : defined;
  };

  line.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
}
