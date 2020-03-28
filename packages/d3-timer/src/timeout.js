import {Timer} from "./timer.js";

// 定时器任务
export default function(callback, delay, time) {
  var t = new Timer;
  delay = delay == null ? 0 : +delay;
  t.restart(function(elapsed) {

    // 注意下面t.stop()执行时，定时器内部__call置空；
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}
