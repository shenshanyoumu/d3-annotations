var exponent = 3;

export var polyIn = (function custom(e) {
  e = +e;

  function polyIn(t) {
    return Math.pow(t, e);
  }

  // 指数型渐变进入
  polyIn.exponent = custom;

  return polyIn;
})(exponent);

export var polyOut = (function custom(e) {
  e = +e;

  // 指数型渐变退出
  function polyOut(t) {
    return 1 - Math.pow(1 - t, e);
  }

  polyOut.exponent = custom;

  return polyOut;
})(exponent);

export var polyInOut = (function custom(e) {
  e = +e;

  // 具有完整渐入/渐出的指数型渐变函数
  function polyInOut(t) {
    return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
  }

  polyInOut.exponent = custom;

  return polyInOut;
})(exponent);
