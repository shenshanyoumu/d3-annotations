// 图表的坐标轴是面向人类的设施，而图表真正操作依赖于scale
// 由于scale不直观，因此才额外增加了坐标轴
// 坐标轴的刻度会结合D3-format模块使用

// 下面这些常量作用是美化坐标轴刻度布局，在进行图表缩放时也能保证显示正常
var e10 = Math.sqrt(50),
  e5 = Math.sqrt(10),
  e2 = Math.sqrt(2);

export default function(start, stop, count) {
  var reverse,
    i = -1,
    n,
    ticks,
    step;

  (stop = +stop), (start = +start), (count = +count);
  if (start === stop && count > 0) return [start];
  if ((reverse = stop < start)) (n = start), (start = stop), (stop = n);
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step))
    return [];

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);
    ticks = new Array((n = Math.ceil(stop - start + 1)));
    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    start = Math.floor(start * step);
    stop = Math.ceil(stop * step);
    ticks = new Array((n = Math.ceil(start - stop + 1)));
    while (++i < n) ticks[i] = (start - i) / step;
  }

  if (reverse) ticks.reverse();

  return ticks;
}

// 坐标轴刻度划分，注意并不一定均匀划分，也可能根据划分规则，比如对数/指数形式
export function tickIncrement(start, stop, count) {
  // 下面的逻辑看起来很复杂，其实就是当图表缩放时，重新计算刻度步长的过程
  var step = (stop - start) / Math.max(0, count),
    power = Math.floor(Math.log(step) / Math.LN10),
    error = step / Math.pow(10, power);

  return power >= 0
    ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) *
        Math.pow(10, power)
    : -Math.pow(10, -power) /
        (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

// 下面的逻辑用于优化坐标轴刻度值在端点的优化显示
export function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
    step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
    error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}
