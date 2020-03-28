export {
  now,
  timer,
  timerFlush
} from "./timer.js";

// 定时任务的执行可以采用requestAnimationFrame或者setTimeout
export {
  default as timeout
} from "./timeout.js";

// 通过宿主原生的setInterval、performance对象来实现
export {
  default as interval
} from "./interval.js";
