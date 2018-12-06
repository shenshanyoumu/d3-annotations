var frame = 0, // is an animation frame pending?
  timeout = 0, // is a timeout pending?
  interval = 0, // are any timers active?
  pokeDelay = 1000, // how frequently we check for clock skew
  // 任务链表头和任务链表尾部
  taskHead,
  taskTail,
  clockLast = 0,
  clockNow = 0,
  clockSkew = 0,
  // performance.now函数得到的时间比Date精确
  clock =
    typeof performance === "object" && performance.now ? performance : Date,
  // 下面函数用于周期性调用动画帧
  setFrame =
    typeof window === "object" && window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : function(f) {
          setTimeout(f, 17);
        };

//尽量基于Window的performance.now函数得到精确的当前时间
export function now() {
  return clockNow || (setFrame(clearNow), (clockNow = clock.now() + clockSkew));
}

function clearNow() {
  clockNow = 0;
}

// 每个任务都绑定了计时器，并且根据链表关系指向下一个任务
export function Timer() {
  this._call = this._time = this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,

  /**
   * 重启计时器，周期性调用回调函数。
   * @param {*} callback 回调函数
   * @param {*} delay 调用周期
   * @param {*} time 以给定时刻为基准开始计时，默认为now
   */
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") {
      throw new TypeError("callback is not a function");
    }

    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);

    // 注意，下面任务队列会依次调用restart方法。其实现原理是每次递归任务修改了this上下文对象
    if (!this._next && taskTail !== this) {
      if (taskTail) {
        taskTail._next = this;
      } else {
        taskHead = this;
      }
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },

  // 停止计时器实例
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

export function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}

export function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead,
    e;

  // 这段代码的核心就是计时器调用所有任务执行
  while (t) {
    if ((e = clockNow - t._time) >= 0) {
      t._call.call(null, e);
    }
    t = t._next;
  }
  --frame;
}

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

function poke() {
  var now = clock.now(),
    delay = now - clockLast;
  if (delay > pokeDelay) (clockSkew -= delay), (clockLast = now);
}

function nap() {
  var t0,
    t1 = taskHead,
    t2,
    time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      (t0 = t1), (t1 = t1._next);
    } else {
      (t2 = t1._next), (t1._next = null);
      t1 = t0 ? (t0._next = t2) : (taskHead = t2);
    }
  }
  taskTail = t0;
  sleep(time);
}

//
function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
  if (delay > 24) {
    // 当动画帧的间隔时间大于24毫秒，则使用setTimeout函数;
    if (time < Infinity)
      timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) {
      interval = clearInterval(interval);
    }
  } else {
    // 当动画帧的调用间隔时间小于24毫秒，则尽可能使用requestAnimationFrame。因为setTimeout存在不可控的延迟
    if (!interval)
      (clockLast = clock.now()), (interval = setInterval(poke, pokeDelay));
    (frame = 1), setFrame(wake);
  }
}
