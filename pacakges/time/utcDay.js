import interval from "./interval";
import { durationDay } from "./duration";

var utcDay = interval(
  // 下面的setUTCHours属于JS的原生方法
  function(date) {
    date.setUTCHours(0, 0, 0, 0);
  },
  function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  },
  function(start, end) {
    return (end - start) / durationDay;
  },
  function(date) {
    return date.getUTCDate() - 1;
  }
);

export default utcDay;
export var utcDays = utcDay.range;
