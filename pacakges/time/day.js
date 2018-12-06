import interval from "./interval";
import { durationDay, durationMinute } from "./duration";

var day = interval(
  function(date) {
    date.setHours(0, 0, 0, 0);
  },
  function(date, step) {
    date.setDate(date.getDate() + step);
  },

  // 参数都是包装了时间的对象结构，其时区偏移相对于格林尼治时区
  function(start, end) {
    return (
      (end -
        start -
        (end.getTimezoneOffset() - start.getTimezoneOffset()) *
          durationMinute) /
      durationDay
    );
  },
  function(date) {
    return date.getDate() - 1;
  }
);

export default day;
export var days = day.range;
