import {slice} from "./array";
import bisect from "./bisect";
import constant from "./constant";
import extent from "./extent";
import identity from "./identity";
import range from "./range";
import {tickStep} from "./ticks";
import sturges from "./threshold/sturges";

/**
 * 与其他图表库直接将数据绑定到特定图表不同，d3引入了图表生成器generator概念；
 * generator可以将原始数据进行转换处理，从而适配特定的图表。本质上就是在数据和渲染器中间
 * 增加了一个抽象层，这样渲染器负责渲染即可
 */
export default function() {
  var value = identity, //默认为等值函数
      domain = extent, //直方图值域
      threshold = sturges; //直方图bin容量计算经验公式

  function histogram(data) {
    var i,
        n = data.length,
        x,
        values = new Array(n);

    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }

    /** 对定义域的区间min和max返回，并根据bin经验公式计算直方图的bin个数tz */
    var xz = domain(values),
        x0 = xz[0],
        x1 = xz[1],
        tz = threshold(values, x0, x1);

    // Convert number of thresholds into uniform thresholds.
    if (!Array.isArray(tz)) {

      /** 刻度间隔 */
      tz = tickStep(x0, x1, tz);

      /** 对scale的定义域离散化处理，注意 */
      tz = range(Math.ceil(x0 / tz) * tz, x1, tz); // exclusive
    }

    // Remove any thresholds outside the domain.
    var m = tz.length;

    /** 数组的shift方法用于从前面出栈；而pop用于从数组尾部出栈。 */
    while (tz[0] <= x0) tz.shift(), --m;
    while (tz[m - 1] > x1) tz.pop(), --m;

    var bins = new Array(m + 1),
        bin;

    // Initialize bins.
    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];

      /** 直方图的bin集合中，每个bin相当于对定义域的划分。因此bin对象[x0,x1]表示范围区间 */
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    }

    // Assign data to bins by value, ignoring any outside the domain.
    for (i = 0; i < n; ++i) {
      x = values[i];
      if (x0 <= x && x <= x1) {

        /** 将属于同一个bin的数值data[i]添加到该bin 中 */
        bins[bisect(tz, x, 0, m)].push(data[i]);
      }
    }

    return bins;
  }

  /** 注意对直方图生成器对象中value属性的重写 */
  histogram.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
  };

  histogram.domain = function(_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
  };

  /** 计算bin的间隔 */
  histogram.thresholds = function(_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
  };

  return histogram;
}
