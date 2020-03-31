import interval from "./interval.js";
import {durationDay, durationMinute} from "./duration.js";

/**
 * interval函数的四个参数，分别为floori、ceil，count，以及field参数
 * 第三个参数count用于求解两个日期之间的天数
 */
var day = interval(function(date) {
  // 当日零点：零分：零秒：零毫秒
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  // 对当前时间增加一个step来形成时间区间的上界ceil
  date.setDate(date.getDate() + step);
}, function(start, end) {
  // getTimeZoneOffset格林尼治时间与当地时间的差值(分钟数)，比如北京时间计算的-480
  // 表示北京时间比格林尼治时间早8小时
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
}, function(date) {
  // 返回当日在当月的天数索引，比如20200330，返回30
  return date.getDate() - 1;
});

export default day;
export var days = day.range;
