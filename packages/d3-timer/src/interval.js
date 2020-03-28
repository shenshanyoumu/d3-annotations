import {Timer, now} from "./timer.js";

// 
export default function(callback, delay, time) {
  var t = new Timer, total = delay;
  if (delay == null) return t.restart(callback, delay, time), t;
  delay = +delay, time = time == null ? now() : +time;

  // 形成周期性调用的模式，其实通过setTimeout来模拟setInterval一样的逻辑
  t.restart(function tick(elapsed) {
    elapsed += total;
    t.restart(tick, total += delay, time);
    callback(elapsed);
  }, delay, time);
  return t;
}
