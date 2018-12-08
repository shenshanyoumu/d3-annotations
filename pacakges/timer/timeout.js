import { Timer } from "./timer";

/**
 * 类似setTimeout函数
 * @param {*} callback 计时器在特定时刻的回调函数
 * @param {*} delay 回调函数在计时器开始计时后延迟delay时间再调用回调
 * @param {*} time 触发计时器开始计时的时刻
 */
export default function(callback, delay, time) {
  var t = new Timer();
  delay = delay == null ? 0 : +delay;
  t.restart(
    // 经过特定的时间，就停止计时器并回调
    function(elapsed) {
      t.stop();
      callback(elapsed + delay);
    },
    delay,
    time
  );
  return t;
}
