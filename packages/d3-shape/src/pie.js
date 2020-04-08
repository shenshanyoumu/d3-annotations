import constant from "./constant.js";
import descending from "./descending.js";
import identity from "./identity.js";
import {tau} from "./math.js";

// 饼图generator，将输入参数转化为饼图的数据结构
// 注意饼图和径向扇形图的差异，饼图没有内半径的说法
export default function() {
  var value = identity,

      // 为了美化饼图展示效果，可以对饼图各分部进行大小排序
      sortValues = descending,
      sort = null,

      // 默认是一个完整圆形
      startAngle = constant(0),
      endAngle = constant(tau),
      padAngle = constant(0);

  // data数组将映射为饼图中各部分绘制位置和大小
  function pie(data) {
    var i,
        n = data.length,
        j,
        k,
        sum = 0,
        index = new Array(n),

        // 饼图中各部分扇形在圆形中的弧线对象
        arcs = new Array(n),

        // 饼图中第一个扇形区域的开始弧度、结束弧度，
        // 以及填充弧度来隔离相邻扇形
        a0 = +startAngle.apply(this, arguments),
        da = Math.min(tau,
           Math.max(-tau, endAngle.apply(this, arguments) - a0)),
        a1,
        p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
        pa = p * (da < 0 ? -1 : 1),
        v;

    // 此时arcs还只是保存了各扇形的关键数据；sum进行扇形数据累加
    // 用于后续在绘制时确定各个扇形的大小
    for (i = 0; i < n; ++i) {
      if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
        sum += v;
      }
    }

    // 对数据进行排序，主要是在绘制时美观可比较
    if (sortValues != null) 
      index.sort(function(i, j) {
         return sortValues(arcs[i], arcs[j]); 
      });

    else if (sort != null) index.sort(function(i, j) { 
      return sort(data[i], data[j]); 
    });

    // 计算饼图中各部分扇形的arc对象，用于在画布上绘制
    for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
      j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
        data: data[j],
        index: i,
        value: v,
        startAngle: a0,
        endAngle: a1,
        padAngle: p
      };
    }

    return arcs;
  }

  pie.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), pie) : value;
  };

  /** 饼图各部分绘制顺序 */
  pie.sortValues = function(_) {
    return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
  };

  pie.sort = function(_) {
    return arguments.length ? (sort = _, sortValues = null, pie) : sort;
  };

  pie.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), pie) : startAngle;
  };

  pie.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), pie) : endAngle;
  };

  /** 饼图的各个业务子块间可能存在填充区域，这就是padAngle的作用 */
  pie.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), pie) : padAngle;
  };

  return pie;
}
