import {slice} from "./array";
import identity from "./identity";

// 图表中坐标轴的放置位置
var top = 1,
    right = 2,
    bottom = 3,
    left = 4,
    epsilon = 1e-6;

    // 标准的CSS语句
function translateX(x) {
  return "translate(" + (x + 0.5) + ",0)";
}

function translateY(y) {
  return "translate(0," + (y + 0.5) + ")";
}

// scale比例尺函数，D3定义了很多比例尺函数用于处理不同的数据格式
function number(scale) {
  return function(d) {
    return +scale(d);
  };
}

function center(scale) {
  // scale.bandwidth表示比例尺离散单位量
  var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
  if (scale.round()) offset = Math.round(offset);

  // 刻度显示在比例尺单元中心附近
  return function(d) {
    return +scale(d) + offset;
  };
}

function entering() {
  return !this.__axis;
}

/**
 * 
 * @param {*} orient 表示坐标轴的位置，上下左右选择
 * @param {*} scale 表示生成坐标轴数值数组的比例尺函数
 */
function axis(orient, scale) {
  var tickArguments = [],
      tickValues = null,
      tickFormat = null,
      tickSizeInner = 6,
      tickSizeOuter = 6,
      tickPadding = 3,
      k = orient === top || orient === left ? -1 : 1,
      x = orient === left || orient === right ? "x" : "y",
      transform = orient === top || orient === bottom ? translateX : translateY;

  function axis(context) {
    // 计算坐标刻度值数组
    var values = tickValues == null ? (scale.ticks ?
        scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,

        // 对坐标刻度值的格式化处理
        format = tickFormat == null ? (scale.tickFormat ? 
          scale.tickFormat.apply(scale, tickArguments) : identity) : tickFormat,

        // 计算坐标刻度间的间距
        spacing = Math.max(tickSizeInner, 0) + tickPadding,

        // 比例尺定义域计算
        range = scale.range(),

        // 坐标轴头尾定义域上离散点处理
        range0 = +range[0] + 0.5,
        range1 = +range[range.length - 1] + 0.5,
        position = (scale.bandwidth ? center : number)(scale.copy()),

        // selection是d3-selection的实现，用于在DOM上选择节点集。下面几行代码用于在图表
        // 绘制坐标轴
        selection = context.selection ? context.selection() : context,
        path = selection.selectAll(".domain").data([null]),
        tick = selection.selectAll(".tick").data(values, scale).order(),
        tickExit = tick.exit(),
        tickEnter = tick.enter().append("g").attr("class", "tick"),
        line = tick.select("line"),
        text = tick.select("text");

      // 坐标轴上刻度线绘制
    path = path.merge(path.enter().insert("path", ".tick")
        .attr("class", "domain")
        .attr("stroke", "currentColor"));

    tick = tick.merge(tickEnter);

    line = line.merge(tickEnter.append("line")
        .attr("stroke", "currentColor")
        .attr(x + "2", k * tickSizeInner));

      // 刻度文字绘制
    text = text.merge(tickEnter.append("text")
        .attr("fill", "currentColor")
        .attr(x, k * spacing)
        .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

    if (context !== selection) {
      // path表示坐标轴轴线；tick表示坐标轴刻度值数组；line表示坐标轴刻度线；text表示刻度文字
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);

      // 刻度线样式变化，将刻度线准确附加到坐标轴上
      tickExit = tickExit.transition(context)
          .attr("opacity", epsilon)
          .attr("transform", function(d) { 
            return isFinite(d = position(d)) ? 
              transform(d) : this.getAttribute("transform"); });

      tickEnter
          .attr("opacity", epsilon)
          .attr("transform", function(d) { 
            var p = this.parentNode.__axis; return transform(p && isFinite(p = p(d)) ? p : position(d)); });
    }

    tickExit.remove();

    path
        .attr("d", orient === left || orient == right
            ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter : "M0.5," + range0 + "V" + range1)
            : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + ",0.5H" + range1));

    tick
        .attr("opacity", 1)
        .attr("transform", function(d) { return transform(position(d)); });

    line
        .attr(x + "2", k * tickSizeInner);

    text
        .attr(x, k * spacing)
        .text(format);

        // 
    selection.filter(entering)
        .attr("fill", "none")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

    selection
        .each(function() { this.__axis = position; });
  }

  axis.scale = function(_) {
    return arguments.length ? (scale = _, axis) : scale;
  };

  axis.ticks = function() {
    return tickArguments = slice.call(arguments), axis;
  };

  axis.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : slice.call(_), axis) : tickArguments.slice();
  };

  axis.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : slice.call(_), axis) : tickValues && tickValues.slice();
  };

  axis.tickFormat = function(_) {
    return arguments.length ? (tickFormat = _, axis) : tickFormat;
  };

  axis.tickSize = function(_) {
    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
  };

  axis.tickSizeInner = function(_) {
    return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
  };

  axis.tickSizeOuter = function(_) {
    return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
  };

  axis.tickPadding = function(_) {
    return arguments.length ? (tickPadding = +_, axis) : tickPadding;
  };

  return axis;
}

export function axisTop(scale) {
  return axis(top, scale);
}

export function axisRight(scale) {
  return axis(right, scale);
}

export function axisBottom(scale) {
  return axis(bottom, scale);
}

export function axisLeft(scale) {
  return axis(left, scale);
}
