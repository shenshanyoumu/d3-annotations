// d3-timer主要是管理DOM动画渲染，frame表示一帧动画任务；
// 如果存在多个动画渲染阶段，则可能有多个frames
var frame = 0, //

    timeout = 0, // is a timeout pending?
    interval = 0, // are any timers active?

    /** 周期性调用回调的时间差，注意最终两次回调间隔依赖JS运行时 */
    pokeDelay = 1000, 
    
    // 计时器队列，即可以存在多个计时器实例；
    // 每个计时器处理一系列动画帧任务
    taskHead,
    taskTail,

    // 最近一次检查点时刻，通过setInterval来定时设置
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,

    // W3C的performance对象是高精度
    clock = typeof performance === "object" && performance.now ? performance : Date,
    
    // 按照60FPS，则一帧渲染实际不超过17秒；否则性能下降
    setFrame = typeof window === "object" && window.requestAnimationFrame ? 
      window.requestAnimationFrame.bind(window) : 
      function(f) { setTimeout(f, 17); };

// 通过一个时间基准点+偏移量来确定当前时刻
export function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

// 计时器对象的内部属性包含：一组回调函数、时刻
export function Timer() {
  this._call =
  this._time =
  this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,

  // delay表示延迟特定时间再开始计时重启；
  // time参数表示在特定的时刻触发restart动作。
  // 注意：如果存在delay参数，则到了time时刻也会等待延迟结束
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") 
      throw new TypeError("callback is not a function");

    // 表示真正开始重新计时的时刻值
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    
    // 在taskTail后面添加当前计时器任务
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }

    // 计时器关联回调任务
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {

    // 回调置空，定时结束时间为无穷大，则该定时器永远也不能结束定时
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

export function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

export function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  
  var t = taskHead, e;
  while (t) {

    // 如果有多个定时器计时结束，则对应的回调都要被执行
    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
    t = t._next;
  }
  --frame;
}

// 注意：类似W3C的event队列。
// setTimeout会在设置的delay时间到来时轮询所有定时器，对于准备就绪的定时任务进行执行
function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

// 通过setInterval来定时更新全局计时变量，比如延迟、时钟偏斜等
// 这些变量对每个计时器的计时过程非常关键
function poke() {
  var now = clock.now(), delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    // 基于setInterval周期性更新clockLast
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    // wake回调来检测是否有定时任务需要被执行
    frame = 1, setFrame(wake);
  }
}
