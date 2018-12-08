import { slice } from "./array";

// 恒等函数
import identity from "./identity";

// 定义坐标轴的布局枚举
var top = 1,
  right = 2,
  bottom = 3,
  left = 4,
  epsilon = 1e-6;

// 基于CSS的translate属性
function translateX(x) {
  return "translate(" + (x + 0.5) + ",0)";
}

function translateY(y) {
  return "translate(0," + (y + 0.5) + ")";
}

// 比例尺函数映射定义域到值域
function number(scale) {
  return function(d) {
    return +scale(d);
  };
}

function center(scale) {
  var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
  if (scale.round()) offset = Math.round(offset);
  return function(d) {
    return +scale(d) + offset;
  };
}

function entering() {
  return !this.__axis;
}

/**
 *
 * @param {*} orient 表示坐标轴在图表的布局位置
 * @param {*} scale
 */
function axis(orient, scale) {
  var tickArguments = [], //坐标轴刻度序列
    tickValues = null, //对刻度内容的数值处理函数
    tickFormat = null, //刻度可视化函数
    tickSizeInner = 6, //默认坐标轴内部刻度线为6PX
    tickSizeOuter = 6, //默认情况下坐标轴两个端点出现的刻度线长度为6PX
    tickPadding = 3, //
    k = orient === top || orient === left ? -1 : 1,
    x = orient === left || orient === right ? "x" : "y",
    transform = orient === top || orient === bottom ? translateX : translateY;

  function axis(context) {
    // 表示刻度值列表
    var values =
        tickValues == null
          ? scale.ticks
            ? scale.ticks.apply(scale, tickArguments)
            : scale.domain()
          : tickValues,
      format =
        tickFormat == null
          ? scale.tickFormat
            ? scale.tickFormat.apply(scale, tickArguments)
            : identity
          : tickFormat,
      spacing = Math.max(tickSizeInner, 0) + tickPadding,
      range = scale.range(),
      range0 = +range[0] + 0.5,
      range1 = +range[range.length - 1] + 0.5,
      position = (scale.bandwidth ? center : number)(scale.copy()),
      selection = context.selection ? context.selection() : context,
      // 最初没有绑定数据时不会产生坐标轴，注意在选择集下定义一个class为domain的DOM节点，因此坐标轴的DOM结构都保存在该容器DOM下
      path = selection.selectAll(".domain").data([null]),
      tick = selection
        .selectAll(".tick")
        .data(values, scale)
        .order(),
      tickExit = tick.exit(),
      tickEnter = tick
        .enter()
        .append("g")
        .attr("class", "tick"),
      line = tick.select("line"),
      text = tick.select("text");

    // 带刻度的坐标轴生成器
    path = path.merge(
      path
        .enter()
        .insert("path", ".tick")
        .attr("class", "domain")
        .attr("stroke", "currentColor")
    );

    tick = tick.merge(tickEnter);

    line = line.merge(
      tickEnter
        .append("line")
        .attr("stroke", "currentColor")
        .attr(x + "2", k * tickSizeInner)
    );

    text = text.merge(
      tickEnter
        .append("text")
        .attr("fill", "currentColor")
        .attr(x, k * spacing)
        .attr(
          "dy",
          orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"
        )
    );

    if (context !== selection) {
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);

      tickExit = tickExit
        .transition(context)
        .attr("opacity", epsilon)
        .attr("transform", function(d) {
          return isFinite((d = position(d)))
            ? transform(d)
            : this.getAttribute("transform");
        });

      tickEnter.attr("opacity", epsilon).attr("transform", function(d) {
        var p = this.parentNode.__axis;
        return transform(p && isFinite((p = p(d))) ? p : position(d));
      });
    }

    tickExit.remove();

    path.attr(
      "d",
      orient === left || orient == right
        ? tickSizeOuter
          ? "M" +
            k * tickSizeOuter +
            "," +
            range0 +
            "H0.5V" +
            range1 +
            "H" +
            k * tickSizeOuter
          : "M0.5," + range0 + "V" + range1
        : tickSizeOuter
        ? "M" +
          range0 +
          "," +
          k * tickSizeOuter +
          "V0.5H" +
          range1 +
          "V" +
          k * tickSizeOuter
        : "M" + range0 + ",0.5H" + range1
    );

    tick.attr("opacity", 1).attr("transform", function(d) {
      return transform(position(d));
    });

    line.attr(x + "2", k * tickSizeInner);

    text.attr(x, k * spacing).text(format);

    // 刻度文字设置
    selection
      .filter(entering)
      .attr("fill", "none")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr(
        "text-anchor",
        orient === right ? "start" : orient === left ? "end" : "middle"
      );

    selection.each(function() {
      this.__axis = position;
    });
  }

  // 由于比例尺变化会影响坐标轴上的刻度值，因此需要记录当前比例尺
  // 在图表初始化时，定义域与值域映射会根据传入的ticks参数来划分坐标轴刻度序列
  axis.scale = function(_) {
    return arguments.length ? ((scale = _), axis) : scale;
  };

  // 坐标轴对象的刻度划分
  axis.ticks = function() {
    return (tickArguments = slice.call(arguments)), axis;
  };

  axis.tickArguments = function(_) {
    return arguments.length
      ? ((tickArguments = _ == null ? [] : slice.call(_)), axis)
      : tickArguments.slice();
  };

  // 如果定义了刻度值数组则使用这个数组值作为刻度，不然使用比例尺自动生成刻度序列
  axis.tickValues = function(_) {
    return arguments.length
      ? ((tickValues = _ == null ? null : slice.call(_)), axis)
      : tickValues && tickValues.slice();
  };

  // 刻度内容格式化
  axis.tickFormat = function(_) {
    return arguments.length ? ((tickFormat = _), axis) : tickFormat;
  };

  //刻度线长度设置
  axis.tickSize = function(_) {
    return arguments.length
      ? ((tickSizeInner = tickSizeOuter = +_), axis)
      : tickSizeInner;
  };

  // 控制坐标轴内部刻度线长度
  axis.tickSizeInner = function(_) {
    return arguments.length ? ((tickSizeInner = +_), axis) : tickSizeInner;
  };

  // 一般情况下，坐标轴两个端点也会增加刻度显示，显然这两个外部的刻度并不是严格根据刻度生成器生成的
  axis.tickSizeOuter = function(_) {
    return arguments.length ? ((tickSizeOuter = +_), axis) : tickSizeOuter;
  };

  axis.tickPadding = function(_) {
    return arguments.length ? ((tickPadding = +_), axis) : tickPadding;
  };

  return axis;
}

// 坐标轴在图表上下左右布局
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
