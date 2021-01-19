var t0 = new Date,
    t1 = new Date;

export default function newInterval(floori, offseti, count, field) {

  /** JS中函数也是对象，可以挂载多个方法。
   *  下面floori为函数参数，接收ECMA规范的日期对象  
   * */
  function interval(date) {
    return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
  }

  /** 基于外部floori函数来处理日期的向下取值
   * 
   */
  interval.floor = function(date) {
    return floori(date = new Date(+date)), date;
  };

  /** ceil计算方式等于floor+1，然后再进行floor。 */
  interval.ceil = function(date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };

  /** 日期的四舍五入操作，比较给定参数date与其floor和ceil的距离 */
  interval.round = function(date) {
    var d0 = interval(date),
        d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };

  /** 在当前date基础上进行step的偏移量处理 */
  interval.offset = function(date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  /** 针对时序的ticks生成器，注意step向下取整逻辑 */
  interval.range = function(start, stop, step) {
    var range = [], previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);

    //参数合法性判断
    if (!(start < stop) || !(step > 0)) return range; 

    //注意最终的时间区间[start,stop)
    do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
    while (previous < start && start < stop);

    return range;
  };

  /** 从函数式编程思路上，所有函子操作返回的函数同一个范畴的对象，
   *  因此返回newInterval函数对象 */
  interval.filter = function(test) {
    return newInterval(function(date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, 
    //第二个参数为offseti函数参数
    function(date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {} 
        } else while (--step >= 0) {
          while (offseti(date, +1), !test(date)) {} 
        }
      }
    });
  };

  /** count参数为计数器函数 */
  if (count) {
    interval.count = function(start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };

    interval.every = function(step) {
      step = Math.floor(step);

      //确保step参数为正数
      return !isFinite(step) || !(step > 0) ? null
          : !(step > 1) ? interval
          : interval.filter(field
              ? function(d) { return field(d) % step === 0; }
              : function(d) { return interval.count(0, d) % step === 0; });
    };
  }

  return interval;
}
