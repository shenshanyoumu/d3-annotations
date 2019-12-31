import interval from "./interval.js";
import {durationDay, durationMinute} from "./duration.js";

/**
 * interval函数的四个参数，分别为floori、ceil，count，以及field参数
 * 第三个参数count用于求解两个日期之间的天数
 */
var day = interval(function(date) {
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setDate(date.getDate() + step);
}, function(start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
}, function(date) {
  return date.getDate() - 1;
});

export default day;
export var days = day.range;
