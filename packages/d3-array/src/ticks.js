var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

/**
 * 根据参数返回长度为count+1的刻度值数组，每个元素值都会转换为以10为底的幂
 * @param {*} start 
 * @param {*} stop 
 * @param {*} count 
 */
export default function(start, stop, count) {
  var reverse,
      i = -1,
      n,
      ticks,
      step;

  /** 下面的代码用于将数字串转换为数值型 */
  stop = +stop, start = +start, count = +count;


  if (start === stop && count > 0) return [start];

  /** 确保start一定小于stop  */
  if (reverse = stop < start) n = start, start = stop, stop = n;

  /** 当刻度间隔非常小，近似为0；或者step刻度间隔无穷大，则直接返回空 */
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);

     /** 没有count参与，通过刻度区间的缩放来实现 */
    ticks = new Array(n = Math.ceil(stop - start + 1));
    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    start = Math.floor(start * step);
    stop = Math.ceil(stop * step);
    ticks = new Array(n = Math.ceil(start - stop + 1));
    while (++i < n) ticks[i] = (start - i) / step;
  }

  if (reverse) ticks.reverse();

  return ticks;
}

/**
 * 类似tickStep函数，除了要求start小于等于step；
 * 如果计算得到的tickStep小于
 * @param {*} start 
 * @param {*} stop 
 * @param {*} count 
 */
export function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count),

      /** 当step小于1，则power为负数 */
      power = Math.floor(Math.log(step) / Math.LN10),
      error = step / Math.pow(10, power);
  
  /** 当power大于0，则该函数功能与tickStep几乎一样；当power小于0，则 */
  return power >= 0
      ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
      : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

/**
 * 返回两个相邻刻度值的差值，由于IEEE754浮动限制，
 * 返回值可能不是整数，可以使用d3-format模块进行格式化
 * @param {*} start 
 * @param {*} stop 
 * @param {*} count 
 */
export function tickStep(start, stop, count) {
  /** 
   *  step0表示数学意义上的均分值，
   *  但是受计算机数值表示位数限制，step0并非精确均分 
   */
  var step0 = Math.abs(stop - start) / Math.max(0, count),

      //Math.LN10表示10的自然对数值，Math.log表示以自然数e为底的对数
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
     
      error = step0 / step1;

  /** 下面的精华，用于返回基于step0的四舍五入值 */
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  
  return stop < start ? -step1 : step1;
}
