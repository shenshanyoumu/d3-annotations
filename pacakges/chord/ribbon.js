import { slice } from "./array";
import constant from "./constant";
import { cos, halfPi, sin } from "./math";
import { path } from "d3-path";

// 弦图一个重要组成部分就是连接圆弧的绶带生成器
function defaultSource(d) {
  return d.source;
}

function defaultTarget(d) {
  return d.target;
}

function defaultRadius(d) {
  return d.radius;
}

function defaultStartAngle(d) {
  return d.startAngle;
}

function defaultEndAngle(d) {
  return d.endAngle;
}

export default function() {
  var source = defaultSource,
    target = defaultTarget,
    radius = defaultRadius,
    startAngle = defaultStartAngle,
    endAngle = defaultEndAngle,
    context = null;

  // 基于贝塞尔曲线绘制绶带
  function ribbon() {
    var buffer,
      argv = slice.call(arguments),
      s = source.apply(this, argv),
      t = target.apply(this, argv),
      sr = +radius.apply(this, ((argv[0] = s), argv)),
      sa0 = startAngle.apply(this, argv) - halfPi,
      sa1 = endAngle.apply(this, argv) - halfPi,
      sx0 = sr * cos(sa0),
      sy0 = sr * sin(sa0),
      tr = +radius.apply(this, ((argv[0] = t), argv)),
      ta0 = startAngle.apply(this, argv) - halfPi,
      ta1 = endAngle.apply(this, argv) - halfPi;

    if (!context) context = buffer = path();

    context.moveTo(sx0, sy0);
    context.arc(0, 0, sr, sa0, sa1);
    if (sa0 !== ta0 || sa1 !== ta1) {
      // TODO sr !== tr?
      context.quadraticCurveTo(0, 0, tr * cos(ta0), tr * sin(ta0));
      context.arc(0, 0, tr, ta0, ta1);
    }
    context.quadraticCurveTo(0, 0, sx0, sy0);
    context.closePath();

    if (buffer) return (context = null), buffer + "" || null;
  }

  // 绶带的绘制半径
  ribbon.radius = function(_) {
    return arguments.length
      ? ((radius = typeof _ === "function" ? _ : constant(+_)), ribbon)
      : radius;
  };

  // 绶带两端的旋转角度，用于美化弦的绘制
  ribbon.startAngle = function(_) {
    return arguments.length
      ? ((startAngle = typeof _ === "function" ? _ : constant(+_)), ribbon)
      : startAngle;
  };

  ribbon.endAngle = function(_) {
    return arguments.length
      ? ((endAngle = typeof _ === "function" ? _ : constant(+_)), ribbon)
      : endAngle;
  };

  // 绶带的source/target其实就是弦图上的subgroup
  ribbon.source = function(_) {
    return arguments.length ? ((source = _), ribbon) : source;
  };

  ribbon.target = function(_) {
    return arguments.length ? ((target = _), ribbon) : target;
  };

  // 绶带上下文属性，用于将当前绶带实例绑定到对应的圆弧对上
  ribbon.context = function(_) {
    return arguments.length
      ? ((context = _ == null ? null : _), ribbon)
      : context;
  };

  return ribbon;
}
