import defaultSource from "./defaultSource";

export default (function sourceRandomUniform(source) {
  //注意defaultSource也是均匀分布生成器，不过分布区间在[0,1]
  // 下面的均匀分布生成器，分布区间为[min,max]
  function randomUniform(min, max) {
    min = min == null ? 0 : +min;
    max = max == null ? 1 : +max;
    if (arguments.length === 1) {
      (max = min), (min = 0);
    } else max -= min;
    return function() {
      return source() * max + min;
    };
  }

  randomUniform.source = sourceRandomUniform;

  return randomUniform;
})(defaultSource);
