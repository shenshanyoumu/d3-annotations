import {slice} from "./array";

var noabort = {};

/**
 * 队列数据结构，包含队列操作回调函数；defer操作必须在await/awaitALl之前完成
 * @param {*} size 
 */
function Queue(size) {
  this._size = size; //任务队列总容量
  this._call = //队列执行await时的临时函数
  this._error = null; //任务队列执行异常时的函数
  this._tasks = []; //基于数组来保存任务实例,每个任务都是一个函数。任务函数最后一个参数为回调函数
  this._data = [];
  this._waiting = //等待执行的任务数
  this._active = //表示正在执行的任务数
  this._ended = //表示已经结束的任务数
  this._start = 0; // 
}

Queue.prototype = queue.prototype = {
  constructor: Queue,
  defer: function(callback) {
    if (typeof callback !== "function") throw new Error("invalid callback");
    
    /** 表示已经开始调用await函数，因此不能继续进行defer操作 */
    if (this._call) throw new Error("defer after await");
    
    /** 表明任务队列执行发生错误，因此直接返回this对象 */
    if (this._error != null) return this;

    /** 每个任务函数都必须有一个回调函数;下面变量t表示一个任务的参数数组 */
    var t = slice.call(arguments, 1);
    t.push(callback);
    ++this._waiting, this._tasks.push(t);

    /** 启动任务队列执行过程 */
    poke(this);
    return this;
  },

  /** 终止任务队列的执行过程，如果任务队列已经发生错误则不能终止 */
  abort: function() {
    if (this._error == null) abort(this, new Error("abort"));
    return this;
  },


  await: function(callback) {
    if (typeof callback !== "function") throw new Error("invalid callback");
    
    /** 执行await操作，则在队列内部通过_call指针进行调用；其中results表示任务执行结果 */
    if (this._call) throw new Error("multiple await");
    this._call = function(error, results) { callback.apply(null, [error].concat(results)); };
   
   
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

/**
 * 队列任务启动
 * @param {*} q 
 */
function poke(q) {
  if (!q._start) {
    try { start(q); } // let the current task complete
    catch (e) {
      if (q._tasks[q._ended + q._active - 1]) abort(q, e); // task errored synchronously
      else if (!q._data) throw e; // await callback errored synchronously
    }
  }
}

function start(q) {
  while (q._start = q._waiting && q._active < q._size) {
    var i = q._ended + q._active, //结束的任务数和正在执行的任务数
        t = q._tasks[i], //表示任务等待子队列中第一个任务函数的参数列表
        j = t.length - 1, //
        c = t[j]; //表示任务函数的回调函数参数
    t[j] = end(q, i);
    --q._waiting, ++q._active;
    t = c.apply(null, t);
    if (!q._tasks[i]) continue; // task finished synchronously
    q._tasks[i] = t || noabort;
  }
}

/** 第i哥任务的结束过程 */
function end(q, i) {
  return function(e, r) {
    /** 如果任务i不存在，则直接结束 */
    if (!q._tasks[i]) return; // ignore multiple callbacks
    --q._active, ++q._ended;
    q._tasks[i] = null;

    /** 如果任务队列已经异常，则直接退出 */
    if (q._error != null) return; // ignore secondary errors

    /** 如果任务i导致异常，则需要终止处理 */
    if (e != null) {
      abort(q, e);
    } else {

      /** 如果任务i正常结束，则保存任务i的执行结果；并且继续执行后续等待任务 */
      q._data[i] = r;
      if (q._waiting) poke(q);
      else maybeNotify(q);//表示所有任务已经执行完毕，则调用全局通知过程
    }
  };
}


function abort(q, e) {
  var i = q._tasks.length, t;
  q._error = e; // ignore active callbacks
  q._data = undefined; // allow gc
  q._waiting = NaN; // prevent starting

  while (--i >= 0) {
    if (t = q._tasks[i]) {
      q._tasks[i] = null;

      /** 任务具有abort接口，才能执行abort操作 */
      if (t.abort) {
        try { t.abort(); }
        catch (e) { /* ignore */ }
      }
    }
  }

  q._active = NaN; // allow notification
  maybeNotify(q);
}

/**
 * 
 * @param {*} q 任务队列实例
 */
function maybeNotify(q) {
  /** 没有正在执行的任务，并且没有await/awaitAll操作 */
  if (!q._active && q._call) {
    var d = q._data;
    q._data = undefined; // allow gc
    q._call(q._error, d);
  }
}

/**
 * 
 * @param {*} concurrency 任务执行的并发度，参数不能小于1;当并发度为1则为串行执行
 * 
 */
export default function queue(concurrency) {
  if (concurrency == null) concurrency = Infinity;
  else if (!((concurrency = +concurrency) >= 1)) throw new Error("invalid concurrency");
  return new Queue(concurrency);
}
