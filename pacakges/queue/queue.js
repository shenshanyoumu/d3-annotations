import { slice } from "./array";

var noabort = {};

// size表示任务的并发数
function Queue(size) {
  this._size = size;
  this._call = this._error = null; //当所有任务执行完毕或者发生错误，则指向回调函数
  this._tasks = []; //任务队列
  this._data = [];

  // 定义任务队列执行的状态
  this._waiting = this._active = this._ended = this._start = 0; // inside a synchronous task callback?
}

Queue.prototype = queue.prototype = {
  constructor: Queue,

  //
  defer: function(callback) {
    if (typeof callback !== "function") {
      throw new Error("invalid callback");
    }

    // 初始情况下，任务还没有执行完毕则_call为null
    if (this._call) {
      throw new Error("defer after await");
    }
    if (this._error != null) {
      return this;
    }
    var t = slice.call(arguments, 1);
    t.push(callback);
    ++this._waiting, this._tasks.push(t);
    poke(this);
    return this;
  },

  // 任务队列终止执行
  abort: function() {
    if (this._error == null) {
      abort(this, new Error("abort"));
    }
    return this;
  },

  // 当所有任务都执行完毕或者出现错误时才会调用await回调
  await: function(callback) {
    if (typeof callback !== "function") {
      throw new Error("invalid callback");
    }
    if (this._call) {
      throw new Error("multiple await");
    }
    this._call = function(error, results) {
      callback.apply(null, [error].concat(results));
    };
    maybeNotify(this);
    return this;
  },
  awaitAll: function(callback) {
    if (typeof callback !== "function") throw new Error("invalid callback");
    if (this._call) throw new Error("multiple await");
    this._call = callback;
    maybeNotify(this);
    return this;
  }
};

function poke(q) {
  if (!q._start) {
    try {
      start(q);
    } catch (e) {
      // let the current task complete
      if (q._tasks[q._ended + q._active - 1]) abort(q, e);
      // task errored synchronously
      else if (!q._data) throw e; // await callback errored synchronously
    }
  }
}

// 开始调用任务队列所有任务
function start(q) {
  while ((q._start = q._waiting && q._active < q._size)) {
    var i = q._ended + q._active,
      t = q._tasks[i],
      j = t.length - 1,
      c = t[j];
    t[j] = end(q, i);
    --q._waiting, ++q._active;
    t = c.apply(null, t);
    if (!q._tasks[i]) continue; // task finished synchronously
    q._tasks[i] = t || noabort;
  }
}

function end(q, i) {
  return function(e, r) {
    if (!q._tasks[i]) return; // ignore multiple callbacks
    --q._active, ++q._ended;
    q._tasks[i] = null;
    if (q._error != null) return; // ignore secondary errors
    if (e != null) {
      abort(q, e);
    } else {
      q._data[i] = r;
      if (q._waiting) poke(q);
      else maybeNotify(q);
    }
  };
}

function abort(q, e) {
  var i = q._tasks.length,
    t;
  q._error = e; // ignore active callbacks
  q._data = undefined; // allow gc
  q._waiting = NaN; // prevent starting

  // 循环遍历任务队列，对每个任务重置为null，并且当任务具有abort函数则执行
  // 因此每个任务实际上可以调用自定义的abort函数
  while (--i >= 0) {
    if ((t = q._tasks[i])) {
      q._tasks[i] = null;
      if (t.abort) {
        try {
          t.abort();
        } catch (e) {
          /* ignore */
        }
      }
    }
  }

  q._active = NaN; // allow notification
  maybeNotify(q);
}

function maybeNotify(q) {
  if (!q._active && q._call) {
    var d = q._data;
    q._data = undefined; // allow gc
    q._call(q._error, d);
  }
}

// 参数concurrency用于设置任务执行的并发数
export default function queue(concurrency) {
  if (concurrency == null) concurrency = Infinity;
  else if (!((concurrency = +concurrency) >= 1))
    throw new Error("invalid concurrency");
  return new Queue(concurrency);
}
