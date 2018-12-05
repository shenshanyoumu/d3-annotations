// 下面函数的功能在Histogram图表、直方图等分组图表很有用
// 即将给定的值域区间按照步长划分为一系列等步长的元素值，并形成数组
export default function(start, stop, step) {
  (start = +start),
    (stop = +stop),
    (step =
      (n = arguments.length) < 2
        ? ((stop = start), (start = 0), 1)
        : n < 3
        ? 1
        : +step);

  var i = -1,
    n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
    range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}
