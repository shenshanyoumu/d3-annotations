/**
 * 根据参数返回离散化的定义域
 * @param {*} start 
 * @param {*} stop 
 * @param {*} step 默认为1
 */
export default function(start, stop, step) {
  /** 下面看似无用的操作，其实是让字符数字转换为数值型；并且填充默认参数值 */
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}
