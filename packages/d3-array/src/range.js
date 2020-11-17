/**
 * 将连续域[start,stop]通过step进行离散化处理
 * @param {*} start 
 * @param {*} stop 
 * @param {*} step 默认为1
 */
export default function(start, stop, step) {
   /** 对参数的个数和类型进行处理，注意参数必须转换为数值型 */
   start = +start, stop = +stop,
   step = (n = arguments.length) < 2 ? 
   (stop = start, start = 0, 1) : n < 3 ? 
   1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}
