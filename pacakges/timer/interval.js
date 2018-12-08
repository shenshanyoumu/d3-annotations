import { Timer, now } from "./timer";

//类似setInterval函数
export default function(callback, delay, time) {
  var t = new Timer(),
    total = delay;

  // 没有延迟时间，则重启计时器函数等待time时刻立刻触发任务执行
  if (delay == null) {
    return t.restart(callback, delay, time), t;
  }
  (delay = +delay), (time = time == null ? now() : +time);
  t.restart(
    // tick函数就是计时器的周期性调用函数，当计时器经过delay的时间区间即执行任务队列
    function tick(elapsed) {
      elapsed += total;
      t.restart(tick, (total += delay), time);
      callback(elapsed);
    },
    delay,
    time
  );
  return t;
}
